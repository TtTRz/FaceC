import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Icon,
  Input,
  List,
  Menu,
  Modal,
  Radio,
  Row,
  Select,
  Result,
} from 'antd';
import React, { Component } from 'react';
import { get } from 'lodash-es';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import styles from './style.less';
import {GroupListItemType, GroupModelState } from "@/models/group";
import {RouterHelper} from "@/utils/router_helpers";

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
// const SelectOption = Select.Option;
const { Search, TextArea } = Input;

interface GroupListProps extends FormComponentProps {
  group: GroupModelState;
  dispatch: Dispatch<any>;
  loading: boolean;
}
interface GroupListState {
  visible: boolean;
  done: boolean;
  current: GroupListItemType;
  mode: string,
}
@connect(
  ({
    group,
    loading,
  }: {
    group: GroupModelState;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    group,
    loading: loading.models.group,
  }),
)
class GroupList extends Component<
  GroupListProps,
  GroupListState
> {
  state: GroupListState = {
    visible: false,
    done: false,
    current: {
      title: '',
      description: '',
      update_time: 0,
      create_time: 0,
      id: -1,
      author: {
        nickname: '',
        id: -1,
      },
    },
    mode: 'add',
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  addBtn: HTMLButtonElement | undefined | null = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/fetchGroupListEffect',
      payload: {

      },
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: {
        title: '',
        description: '',
        update_time: 0,
        create_time: 0,
        id: -1,
        author: {
          nickname: '',
          id: -1,
        },
      },
      mode: 'add',
    });
  };

  showEditModal = (item: GroupListItemType) => {
    this.setState({
      visible: true,
      current: item,
      mode: 'edit',
    });
  };

  handleDone = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';

    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    form.validateFields((err: string | undefined, fieldsValue: GroupListItemType) => {
      if (err) return;
      this.setState({
        done: true,
      });
      dispatch({
        type: `group/${this.state.mode}GroupEffect`,
        payload: this.state.mode === "edit" ? {
          id, ...fieldsValue
        } : {
          ...fieldsValue
        }
      }).then(() => {
        dispatch({
          type: 'group/fetchGroupListEffect',
          payload: {

          },
        });
      })
    });
  };

  deleteItem = (id: number) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/delGroupEffect',
      payload: { id },
    }).then(() => {
      dispatch({
        type: 'group/fetchGroupListEffect',
        payload: {

        },
      });
    });
  };

  render() {
    const {
      group,
      loading,
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { visible, done, current } = this.state;

    const editAndDelete = (key: string, currentItem: GroupListItemType) => {
      if (key === 'edit') this.showEditModal(currentItem);
      else if (key === 'delete') {
        Modal.confirm({
          title: '删除任务',
          content: '确定删除该任务吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.deleteItem(currentItem.id),
        });
      }
    };

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: this.state.mode === "edit" ? '保存':'添加', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const Info: React.FC<{
      title: React.ReactNode;
      value: React.ReactNode;
      bordered?: boolean;
    }> = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="progress">进行中</RadioButton>
          <RadioButton value="waiting">未开始</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: group.group_list.pagination.limit,
      total: group.group_list.pagination.total
    };

    const ListContent = ({
      data,
    }: {
      data: GroupListItemType;
    }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>负责人</span>

          <p>{get(data, 'author.nickname', '')}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>创建时间</span>
          <p>{moment(data.create_time * 1000).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        {/*<div className={styles.listContentItem}>*/}
          {/*<Progress percent={percent} status={status} strokeWidth={6} style={{ width: 180 }} />*/}
        {/*</div>*/}
      </div>
    );

    const MoreBtn: React.FC<{
      item: GroupListItemType;
    }> = ({ item }) => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => editAndDelete(key, item)}>
            <Menu.Item key="edit">编辑</Menu.Item>
            <Menu.Item key="delete">删除</Menu.Item>
          </Menu>
        }
      >
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            status="success"
            title={this.state.mode === "edit" ? "保存成功": "添加成功" }
            extra={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="分组名称" {...this.formLayout}>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入分组名称' }],
              initialValue: current.title,
            })(<Input placeholder="请输入" />)}
          </FormItem>

          {this.state.mode === "edit" && <FormItem label="负责人" {...this.formLayout}>
            {getFieldDecorator('author', {
              rules: [{ required: true, message: '请选择负责人' }],
              initialValue: current.author.nickname,
            })(
              <Select placeholder="请选择">
              </Select>,
            )}
          </FormItem>}
          <FormItem {...this.formLayout} label="分组描述">
            {getFieldDecorator('description', {
              rules: [{ message: '请输入至少五个字符的分组描述！', min: 5 }],
              initialValue: current.description,
            })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
          </FormItem>
        </Form>
      );
    };
    return (
      <>
        <PageHeaderWrapper>
          <div className={styles.standardList}>
            <Card bordered={false}>
              <Row>
                <Col sm={8} xs={24}>
                  <Info title="分组总数" value={`${group.group_list.list.length}个分组`} bordered />
                </Col>
                <Col sm={8} xs={24}>
                  <Info title="xxx" value="xxx" bordered />
                </Col>
                <Col sm={8} xs={24}>
                  <Info title="本周活跃分组" value="xxx" />
                </Col>
              </Row>
            </Card>

            <Card
              className={styles.listCard}
              bordered={false}
              title="分组"
              style={{ marginTop: 24 }}
              bodyStyle={{ padding: '0 32px 40px 32px' }}
              extra={extraContent}
            >
              <Button
                type="dashed"
                style={{ width: '100%', marginBottom: 8 }}
                icon="plus"
                onClick={this.showModal}
                ref={component => {
                  // eslint-disable-next-line  react/no-find-dom-node
                  this.addBtn = findDOMNode(component) as HTMLButtonElement;
                }}
              >
                添加
              </Button>
              <List
                size="large"
                rowKey="id"
                loading={loading}
                pagination={paginationProps}
                dataSource={group.group_list.list}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <a
                        key="edit"
                        onClick={e => {
                          e.preventDefault();
                          this.showEditModal(item);
                        }}
                      >
                        编辑
                      </a>,
                      <MoreBtn key="more" item={item} />,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src='https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png' shape="square" size="large" />}
                      title={<a onClick={() => RouterHelper({path: '/group/:gid', pathParams: {gid: item.id}, query: {}})}>{item.title}</a>}
                      description={item.description}
                    />
                    <ListContent data={item} />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </PageHeaderWrapper>

        <Modal
          title={done ? null : `分组${this.state.mode === "edit" ? '编辑' : '添加'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </>
    );
  }
}

export default Form.create<GroupListProps>()(GroupList);
