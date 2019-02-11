/**
 * title: Index
 * Routes:
 *   - ./src/routes/PrivateRoute.js
 */
import React, { Component } from 'react';
import { ActionSheet, Drawer, List, NavBar, Icon } from 'antd-mobile';
import router from 'umi/router';
import { inject, observer } from 'mobx-react';

import css from './_layout.css';

const tabs = [
  { class: 'icon-video', key: 'home' },
  { class: 'icon-shopping', key: 'find' },
  { class: 'icon-direct', key: 'ranking' },
];
@inject('store')
@observer
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'redTab',
      hidden: false,
      fullScreen: false,
      open: false,
    };
    this.showActionSheet = this.showActionSheet.bind(this);
  }
  onOpenChange = (...args) => {
    console.log(args);
    this.setState({ open: !this.state.open });
  };
  showActionSheet() {
    const BUTTONS = ['关于', '删除', '关闭'];
    ActionSheet.showActionSheetWithOptions(
      {
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        destructiveButtonIndex: BUTTONS.length - 2,
        // title: 'title',
        message: 'gqyq',
        maskClosable: true,
        // 'data-seed': 'logId',
        // wrapProps,
      },
      buttonIndex => {
        this.setState({ clicked: BUTTONS[buttonIndex] });
      }
    );
  }
  iSFirst(key) {
    let flag = false;
    if (key === '/index/home' || key === '/index/find' || key === '/index/ranking') {
      flag = true;
    }
    return flag;
  }
  render() {
    let template = null;
    const sidebar = (
      <List>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i, index) => {
          if (index === 0) {
            return (
              <List.Item
                key={index}
                thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
                multipleLine
              >
                Category
              </List.Item>
            );
          }
          return (
            <List.Item
              key={index}
              thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
            >
              Category{index}
            </List.Item>
          );
        })}
      </List>
    );
    if (this.iSFirst(this.props.location.pathname)) {
      template = (
        <Drawer
          className={css['my-drawer']}
          style={{ minHeight: document.documentElement.clientHeight }}
          enableDragHandle
          sidebar={sidebar}
          open={this.state.open}
          onOpenChange={this.onOpenChange}
          // touch={false}
        >
          <div className={css.content}>
            <div className={css.top_tabs}>
              <div>
                <i className="iconfont icon-list" onClick={this.onOpenChange} />
              </div>
              <div>
                {tabs.map(item => (
                  <i
                    className={['iconfont', item.class].join(' ')}
                    key={item.key}
                    onClick={() => router.push(`/index/${item.key}`)}
                  />
                ))}
              </div>
              <div>
                <i className="iconfont icon-search" />
              </div>
            </div>
            <div className={css.body}>{this.props.children}</div>
          </div>
        </Drawer>
      );
    } else {
      template = (
        <div className={css.content}>
          <div className={css.top_tabs}>
            <div>
              <i className="iconfont icon-zuojiantou" onClick={() => router.goBack()} />
              {this.props.store.title}
            </div>
            <div>
              <i className="iconfont icon-search" />
              <i className="iconfont icon-more" />
            </div>
          </div>
          <div className={css.body}>{this.props.children}</div>
        </div>
      );
    }
    return template;
  }
}
export default App;
