import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { ConnectState, ConnectProps } from '@/models/connect';
import PageLoading from '@/components/PageLoading';

interface SecurityLayoutProps extends ConnectProps {
  loading: boolean;
  logined: boolean;

}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,

  };

  componentDidMount() {
    this.setState({
      ...this.state,
      isReady: true,
    });
    const { dispatch } = this.props;
    if ( dispatch ) {
      /*
        验证登录状态
      */
      dispatch({
        type: 'login/checkLogin'
      })
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, logined } = this.props;
    const isLogin = logined;
    const queryString = stringify({
      redirect: window.location.href,
    });
    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }
    if (!isLogin) {
      return <Redirect to={`/user/login?${queryString}`}></Redirect>;
    }
    return children;
  }
}

export default connect(({ login, loading }: ConnectState) => ({
  logined: login.logined,
  loading: loading.global,
}))(SecurityLayout);
