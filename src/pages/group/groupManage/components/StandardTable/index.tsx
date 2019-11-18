import { Alert, Table } from 'antd';
import { ColumnProps, TableRowSelection, TableProps } from 'antd/es/table';
import React, { Component, Fragment } from 'react';

import styles from './index.less';

import {ManageListItemType, PaginationType} from "@/models/group";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StandardTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: StandardTableColumnProps[];
  data: {
    list: ManageListItemType[];
    // pagination: PaginationType;
  };
  selectedRows: ManageListItemType[];
  onSelectRow: (rows: any) => void;
}

export interface StandardTableColumnProps extends ColumnProps<ManageListItemType> {
  needTotal?: boolean;
  total?: number;
}

function initTotalList(columns: StandardTableColumnProps[]) {
  if (!columns) {
    return [];
  }
  const totalList: StandardTableColumnProps[] = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

interface StandardTableState {
  selectedRowKeys: string[];
  needTotalList: StandardTableColumnProps[];
}

class StandardTable extends Component<StandardTableProps<ManageListItemType>, StandardTableState> {
  static getDerivedStateFromProps(nextProps: StandardTableProps<ManageListItemType>) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  constructor(props: StandardTableProps<ManageListItemType>) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  handleRowSelectChange: TableRowSelection<ManageListItemType>['onChange'] = (
    selectedRowKeys,
    selectedRows: ManageListItemType[],
  ) => {
    const currySelectedRowKeys = selectedRowKeys as string[];
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex || 0]), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys: currySelectedRowKeys, needTotalList });
  };

  handleTableChange: TableProps<ManageListItemType>['onChange'] = (
    pagination,
    filters,
    sorter,
    ...rest
  ) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter, ...rest);
    }
  };

  cleanSelectedKeys = () => {
    if (this.handleRowSelectChange) {
      this.handleRowSelectChange([], []);
    }
  };

  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const { data, rowKey, ...rest } = this.props;
    const { list = [] } = data || {};

    // const paginationProps = pagination
    //   ? {
    //       showSizeChanger: true,
    //       showQuickJumper: false,
    //       ...pagination,
    //     }
    //   : false;

    const rowSelection: TableRowSelection<ManageListItemType> = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: (record: ManageListItemType) => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        {console.log(list)}
        <Table
          rowKey={rowKey || 'key'}
          rowSelection={rowSelection}
          dataSource={list}
          pagination={false}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;
