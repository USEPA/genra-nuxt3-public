export interface KetcherObj {
  standalone: boolean;
  getSmilesAsync: () => Promise<string>;
}
