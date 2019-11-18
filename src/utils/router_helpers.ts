import router from 'umi/router';
import PathToRegexp from 'path-to-regexp'

export const RouterHelper = ({ path , query = {}, pathParams = {} }: {path:string, query: any, pathParams: any}) => {
  const pattern = PathToRegexp.compile(path)
  router.push({
    pathname: pattern(pathParams),
    query: {
      ...query,
    }
  })
}
