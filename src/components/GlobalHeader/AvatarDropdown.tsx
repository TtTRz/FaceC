import { Avatar, Icon, Menu, Spin } from 'antd';
import { ClickParam } from 'antd/es/menu';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { connect } from 'dva';
// import router from 'umi/router';

import { ConnectProps, ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import {ResourcesRequest} from "@/utils/resources_request";

export interface GlobalHeaderRightProps extends ConnectProps {
  currentUser?: CurrentUser;
  menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }
    // router.push(`/account/${key}`);
  };

  render(): React.ReactNode {
    const { currentUser = { avator: '', nickname: '' }, menu } = this.props;

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <Icon type="user" />
            <FormattedMessage id="menu.account.center" defaultMessage="account center" />
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <Icon type="setting" />
            <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );

    return currentUser && currentUser.nickname ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={ResourcesRequest(currentUser.avator)} alt="avatar" />
          <span className={styles.name}>{currentUser.nickname}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    );
  }
}
export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
