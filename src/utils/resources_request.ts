
export const ResourcesRequest = (vpath: string | undefined) => {
  if(vpath === undefined) {
    return '';
  }
  return `https://api.fh.shoogoome.com/resources/${vpath}`;
}
