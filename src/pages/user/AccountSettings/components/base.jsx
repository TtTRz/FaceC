import { Button, Form, Input, Select, Upload, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
import styles from './BaseView.less';

const FormItem = Form.Item;
const { Option } = Select; // 头像组件 方便以后独立，增加裁剪之类的功能

const AvatarView = ({ avatar }) => (
  <Fragment>
    <div className={styles.avatar_title}>
      <FormattedMessage id="userandaccountsettings.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload fileList={[]}>
      <div className={styles.button_view}>
        <Button icon="upload">
          <FormattedMessage
            id="userandaccountsettings.basic.change-avatar"
            defaultMessage="Change avatar"
          />
        </Button>
      </div>
    </Upload>
  </Fragment>
);


@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class BaseView extends Component {
  view = undefined;

  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;

    if (currentUser) {
      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = currentUser[key] || null;
        form.setFieldsValue(obj);
      });
    }
  };

  getAvatarURL() {
    const { currentUser } = this.props;

    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }

      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }

    return '';
  }

  getViewDom = ref => {
    this.view = ref;
  };

  handlerSubmit = event => {
    event.preventDefault();
    const { form } = this.props;
    this.props.dispatch({
      type: 'user/editUser',
      payload: {
        userId: this.props.currentUser.id,
        nickname: form.getFieldValue('nickname'),
        motto: form.getFieldValue('motto'),
        phone: form.getFieldValue('phone'),
        sex: 0,
      },
    });
    form.validateFields(err => {
      if (!err) {
        message.success(
          formatMessage({
            id: 'userandaccountsettings.basic.update.success',
          }),
        );
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem
              label={formatMessage({
                id: 'userandaccountsettings.basic.nickname',
              })}
            >
              {getFieldDecorator('nickname', {
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      {
                        id: 'userandaccountsettings.basic.nickname-message',
                      },
                      {},
                    ),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem
              label={formatMessage({
                id: 'userandaccountsettings.basic.profile',
              })}
            >
              {getFieldDecorator('motto', {
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      {
                        id: 'userandaccountsettings.basic.profile-message',
                      },
                      {},
                    ),
                  },
                ],
              })(
                <Input.TextArea
                  placeholder={formatMessage({
                    id: 'userandaccountsettings.basic.profile-placeholder',
                  })}
                  rows={4}
                />,
              )}
            </FormItem>

            <FormItem
              label={formatMessage({
                id: 'userandaccountsettings.basic.phone',
              })}
            >
              {getFieldDecorator('phone', {
                rules: [
                  {
                    message: formatMessage(
                      {
                        id: 'userandaccountsettings.basic.phone-message',
                      },
                      {},
                    ),
                  },
                ],
              })(<PhoneView />)}
            </FormItem>
            <Button type="primary" onClick={this.handlerSubmit}>
              <FormattedMessage
                id="userandaccountsettings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} />
        </div>
      </div>
    );
  }
}

export default Form.create()(BaseView);
