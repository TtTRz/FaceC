import {
  Badge,
  Button,
  Card,
  Divider,
  Dropdown,
  Form,
  Icon,
  Menu,
  Select,
  message,
  Modal,
  Upload,
} from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { TableListParams } from './data.d';

import styles from './style.less';

import {GroupModelState, ManageListItemType, PaginationType} from "@/models/group";

const FormItem = Form.Item;
const { Option } = Select;

const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

type IStatusMapType = 'default' | 'processing' | 'success' | 'error';
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'groupAndgroupManage/add'
      | 'groupAndgroupManage/fetch'
      | 'groupAndgroupManage/remove'
      | 'groupAndgroupManage/update'
      | 'group/fetchManageListEffect'
      | 'group/delManageListEffect'
      | 'group/mpostManageListEffect'
    >
  >;
  match: any,
  loading: boolean;
  group: GroupModelState;
}

interface TableListState {
  modalVisible: boolean;
  selectedRows: ManageListItemType[];
  formValues: { [key: string]: string };
  stepFormValues: ManageListItemType[];
  uploading: boolean,
  fileList: [],
  uploadDone: boolean,
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    group,
    loading,
  }: {
    group: GroupModelState;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    group,
    loading: loading.models.group,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: [],
    uploading: false,
    fileList: [],
    uploadDone: false,
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '学号',
      dataIndex: 'code',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      render: (val: any) => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a>修改</a>
          <Divider type="vertical" />
          <a style={{ color: 'red'}} href="">删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/fetchManageListEffect',
      payload: {
        id: this.props.match.params.gid,
      }
    });
  }

  handleStandardTableChange = (
    pagination: Partial<PaginationType>,
    filtersArg: Record<keyof ManageListItemType, string[]>,
    sorter: SorterResult<ManageListItemType>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      currentPage: pagination.page,
      pageSize: pagination.limit,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'groupAndgroupManage/fetch',
      payload: params,
    });
  };


  handleMenuClick = (e: { key: string }) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'groupAndgroupManage/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = (rows: ManageListItemType[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 控制上传MODAL
  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  // 上传
  handleUpload = () => {
    const { fileList } = this.state;
    const { dispatch } = this.props;
    this.setState({
      uploading: true,
    });
    dispatch({
      type: 'group/mpostManageListEffect',
      payload: {
        id: this.props.match.params.gid,
        fileList,
        onSuccess: (res: boolean) => {
          // @ts-ignore
          this.setState({
            uploading: false,
            fileList: [],
            modalVisible: false,
          });
          if(res) {
            message.success("上传成功");
          } else {
            message.error("上传失败");
          }
        }
      },
    })
  };
  render() {
    const {
      group,
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const { uploading, fileList } = this.state;

    const uploadProps = {
      onRemove: (file: any) => {
        // @ts-ignore
        this.setState((state: TableListState) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file: any) => {
        // @ts-ignore
        this.setState((state: TableListState) => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };
    console.log(group.manage_list)
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                上传
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={group.manage_list}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <Modal
          destroyOnClose
          visible={modalVisible}
          title="上传脸谱"
          // onOk={this.handleOk}
          onCancel={() => this.handleModalVisible(false)}
          footer={[
            <Button
              key="submit"
              type="primary"
              loading={uploading}
              disabled={fileList.length === 0}
              onClick={this.handleUpload}
            >
              {uploading ? '上传中' : '上传'}
            </Button>,
          ]}
        >
          <Upload
            {...uploadProps}
            multiple
          >
            <Button>
              <Icon type="upload" /> 选择图片
            </Button>
          </Upload>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
