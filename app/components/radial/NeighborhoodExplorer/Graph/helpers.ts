import type {
  DownloadGraphData,
  ForceGraphData,
  ForceGraphEdge,
  ForceGraphNode,
  GraphData, GraphLink,
  GraphNode,
} from '../types';
import type {NeighborhoodGraphResponse} from '~/api/types';
import type {Dtxcid, Dtxsid} from '~~/types';

const addCurvature = (linkData: GraphLink[]) => {
  const selfLoopLinks = {} as {
    [key: string]: GraphLink[];
  };
  const sameNodesLinks = {} as {
    [key: string]: GraphLink[];
  };
  const curvatureMinMax = 0.5;
  linkData.forEach((link) => {
    link.nodePairId = link.source <= link.target ? (`${link.source}_${link.target}`) : (`${link.target}_${link.source}`);
    const map = link.source === link.target ? selfLoopLinks : sameNodesLinks;
    if (!(link.nodePairId in map)) {
      map[link.nodePairId] = [];
    }
    map[link.nodePairId]?.push(link);
  });

  // Compute the curvature for self-loop links to avoid overlaps
  Object.keys(selfLoopLinks).forEach((id) => {
    const links = selfLoopLinks[id] || [];
    const lastIndex = links.length - 1;
    links[lastIndex]!.curvature = 1;
    const delta = (1 - curvatureMinMax) / lastIndex;
    for (let i = 0; i < lastIndex; i += 1) {
      links[i]!.curvature = curvatureMinMax + i * delta;
    }
  });
  // Compute the curvature for links sharing the same two nodes to avoid overlaps
  Object.keys(sameNodesLinks).filter(nodePairId => sameNodesLinks?.[nodePairId]!.length > 1).forEach((nodePairId) => {
    const links = sameNodesLinks[nodePairId] || [];
    const lastIndex = links.length - 1;
    const lastLink = links[lastIndex];
    lastLink!.curvature = curvatureMinMax;
    const delta = 2 * curvatureMinMax / lastIndex;
    for (let i = 0; i < lastIndex; i += 1) {
      links[i]!.curvature = -curvatureMinMax + i * delta;
      if (lastLink!.source !== links[i]!.source) {
        // flip it around, otherwise they overlap
        links[i]!.curvature = (links[i]?.curvature ?? 0) * -1;
      }
    }
  });
};

export const convertApiResponseToGraphData = (apiResponse: NeighborhoodGraphResponse, targetChemId: string): GraphData => {
  const edgesFromTree = [...new Set(apiResponse.edges.map(({to}) => to))];

  const targets = apiResponse.edges.filter(({from}) => from === targetChemId).map(({to}) => to);

  const nodes = Object.keys(apiResponse.nodes).map((node) => {
    const nodeKey = node as Dtxcid | Dtxsid;
    const nodeObj = apiResponse.nodes[nodeKey];
    return {
      id: nodeKey,
      ...(nodeObj?.isTarget && {isTarget: nodeObj?.isTarget}),
      ...nodeObj,
    };
  }).concat(edgesFromTree.map(edge => ({id: edge})).filter(({id}) => !Object.keys(apiResponse.nodes).includes(id)))
    .map(node => ({...node, isTargetNeighbor: targets.includes(node.id)}));
  const links = apiResponse.edges.map(edge => ({
    ...edge,
    source: edge.from,
    target: edge.to,
  }));
  addCurvature(links);
  return {
    nodes: nodes as GraphNode[],
    links,
  };
};

export const getEdgeWith = (simWeight: number) => {
  if (simWeight >= 0.45) {
    return 6.0;
  }
  if (simWeight < 0.45 && simWeight > 0.2) {
    return 3.5;
  }
  if (simWeight < 0.2) {
    return 1;
  }
  return 1;
};

export const getNodeColor = (node: ForceGraphNode) => {
  if (node.isTarget) {
    return 'red';
  }
  if (node.expanded) {
    return 'green';
  }
  return '#205493';
};

export const getLinkColor = (edgeType: string) => {
  const {setupResponse} = useAppBaseStore();
  return setupResponse.fpColor[edgeType];
};

export const getNodeLabel = (node: ForceGraphNode) => {
  const {
    dsstox_cid: cid, dsstox_sid: sid, name: chemName,
  } = node;
  let returnStr = `${chemName}<br/>`;
  if (cid) {
    returnStr += `${cid}<br/>`;
  }
  if (sid) {
    returnStr += `${sid}<br/>`;
  }
  return returnStr;
};

export const onNodeDrag = (node: ForceGraphNode, graphData: ForceGraphData) => {
  const {nodes} = graphData;
  nodes.forEach((dragNode) => {
    if (dragNode.id !== node.id) {
      dragNode.fx = dragNode.x;
      dragNode.fy = dragNode.y;
    }
  });
};

export const onNodeDragEnd = (node: ForceGraphNode) => {
  node.fx = node.x;
  node.fy = node.y;
};

export const getNodeCanvasObjectMode = (node: ForceGraphNode) => {
  if (node.isTargetNeighbor) {
    return 'after';
  }
  if (node.isViewing) {
    return 'before';
  }
  return '';
};

export const getNodeCanvasObject = (node: ForceGraphNode, ctx: CanvasRenderingContext2D) => {
  if (node.isTargetNeighbor) {
    ctx.fillRect(node.x - 4, node.y - 4, 8, 8);
  }

  // add ring just for node being viewed- circle
  if (node.isViewing && !node.isTargetNeighbor) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, 4 * 1.4, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'black';
    ctx.fill();
  }
  // square
  if (node.isViewing && node.isTargetNeighbor) {
    ctx.beginPath();
    ctx.rect(node.x - 4, node.y - 4, 8.2, 8.2);

    ctx.fillStyle = 'black';
    ctx.stroke();
  }
};

export const convertGraphDataToDownloadObj = (graphData: ForceGraphData) => {
  const {
    links, nodes, ...newObj
  } = structuredClone(toRaw(graphData));
  const downloadObj = newObj as DownloadGraphData;
  downloadObj.nodes = nodes.map(({
    // eslint-disable-next-line camelcase
    dsstox_sid, dsstox_cid, name, mol_weight, expanded, isTarget,
  }) => {
    const isNewTarget = isTarget || false;
    return {
      // eslint-disable-next-line camelcase
      dsstox_sid, dsstox_cid, name, mol_weight, expanded, isTarget: isNewTarget,
    };
  });
  downloadObj.edges = links.map(({
    from, to, step, similarity, type,
  }) => {
    return {
      from, to, step, similarity, type,
    };
  });
  return downloadObj;
};

export const mergeGraphData = (currentGraphData: ForceGraphData, expandedGraphData: ForceGraphData | GraphData) => {
  if (currentGraphData?.links) {
    const currentGraphLinkIdxs = currentGraphData.links.map(link => `${link.source.id}${link.target.id}`);
    for (const element of expandedGraphData.links) {
      if (!currentGraphLinkIdxs.includes(`${(element?.source as ForceGraphNode).id}${(element?.target as ForceGraphNode).id}`) && element) {
        currentGraphData.links.push(element as ForceGraphEdge);
      }
    }
  }

  if (currentGraphData?.nodes) {
    const currentGraphNodes = currentGraphData.nodes.map(cnode => cnode.id);
    for (const element of expandedGraphData.nodes) {
      if (currentGraphNodes.includes(element?.id)) {
        const currentGraphUpdateIdx = currentGraphData.nodes.findIndex(cnode => cnode.id === element?.id);
        currentGraphData.nodes[currentGraphUpdateIdx]!.expanded =
      currentGraphData.nodes?.[currentGraphUpdateIdx]?.expanded || (element as ForceGraphNode)?.expanded;
      } else if (element) {
        currentGraphData.nodes.push(element as ForceGraphNode);
      }
    }
  }
};

export const graphDataIsEmpty = (data: NeighborhoodGraphResponse) => !data.edges?.length &&
  !Object.keys(data?.nodes)?.length;
