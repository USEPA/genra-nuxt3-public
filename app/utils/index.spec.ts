import {
  describe, expect, it,
} from 'vitest';
import {
  getFileNameFromHeaders, getSvgImgUrl, getDateTimeForNeExport, getStrWithEllipsis,
} from '.';

describe('Utilities', () => {
  it('tests file name from headers', () => {
    const fileName = 'genra_20250330_140627.png';
    const testHeaders = new Headers();
    testHeaders.set('content-disposition', `attachment; filename=${fileName}`);
    const fileNameFromHeaders = getFileNameFromHeaders(testHeaders);
    expect(fileNameFromHeaders).toBe(fileName);

    testHeaders.delete('content-disposition');
    const fileNameFromHeadersFalsy = getFileNameFromHeaders(testHeaders);
    expect(fileNameFromHeadersFalsy).toBe('');
  });

  it('tests getting svg url', () => {
    const testChemId = 'testId';
    const svgUrl = getSvgImgUrl(testChemId);
    expect(svgUrl).includes(testChemId);
  });

  it('tests date time for neighborhood explorer export', () => {
    const dateTime = getDateTimeForNeExport();
    expect(dateTime).toBeTruthy();
  });

  it('tests truncating string with ellipsis', () => {
    const strWithEllipsis = getStrWithEllipsis('teststring', 4);
    expect(strWithEllipsis).includes('...');

    const strWithoutEllipsis = getStrWithEllipsis('teststring', 15);
    expect(strWithoutEllipsis).not.includes('...');
  });
});
