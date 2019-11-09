import React, { Fragment, PureComponent } from 'react';
import { Input } from 'antd';
import styles from './PhoneView.less';

class PhoneView extends PureComponent {
  render() {
    const { value, onChange } = this.props;

    return (
      <Fragment>
        <Input
          className={styles.phone_number}
          onChange={e => {
            if (onChange) {
              onChange(`${e.target.value}`);
            }
          }}
          value={value}
        />
      </Fragment>
    );
  }
}

export default PhoneView;
