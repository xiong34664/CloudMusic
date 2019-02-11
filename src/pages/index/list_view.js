import styles from './list_view.css';

/* eslint no-dupe-keys: 0, no-mixed-operators: 0 */
import React, { Component } from 'react';
import { PullToRefresh, ListView, Button, Toast } from 'antd-mobile';
import { getPlaylistDetail, getSongDetail } from '@service';

export default class App extends Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      dataSource,
      refreshing: true,
      isLoading: true,
      height: document.documentElement.clientHeight,
      useBodyScroll: true,
      listData: [],
      pageNum: 1
    };
    this.getDetail = this.getDetail.bind(this);
    this.getList = this.getList.bind(this);
  }

  // If you use redux, the data maybe at props, you need use `componentWillReceiveProps`
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.dataSource !== this.props.dataSource) {
  //     this.setState({
  //       dataSource: this.state.dataSource.cloneWithRows(nextProps.dataSource),
  //     });
  //   }
  // }

  componentDidUpdate() {
    //   if (this.state.useBodyScroll) {
    //     document.body.style.overflow = 'auto';
    //   } else {
    //     document.body.style.overflow = 'hidden';
    //   }
  }
  componentDidMount() {
    this.getDetail();
  }
  getDetail() {
    const id = 2629041485;
    Toast.loading('Loading...', 30);
    getPlaylistDetail({ id })
      .then(result => {
        this.setState(
          {
            playlist: result.playlist,
            privileges: result.privileges,
            loading: false,
          },
          this.getList
        );
      })
      .catch(err => {});
  }
  getList() {
    console.log(111)
    const list = this.state.privileges.splice((this.state.pageNum - 1) * 20, 20);
    if (list.length < 20) {
      this.setState({ isLoading: false });
    }
    const pro = Promise.all(list.map(item => getSongDetail({ ids: item.id })));
    pro.then(res => {
      Toast.hide();
      const data = [];
      res.forEach(item => data.push(item.songs[0]));
      this.setState({
        listData: [...this.state.listData, ...data],
        loading: false,
        // refreshing: false,
        dataSource: this.state.dataSource.cloneWithRows([...this.state.listData, ...data]),
      });
    });
  }

  //下拉刷新
  refreshing() {
    this.setState({ refreshing: true });
    this.getList();
  }
  //上拉
  onEndReached = () => {
    console.log('上拉')
    let { isLoading } = this.state;
    if (!isLoading) {
      return;
    }
    this.setState( {  pageNum: this.state.pageNum+ 1, },this.getList);
  };
  render() {
    const row = (item, sectionID, rowID) => <div className="song-list" key={rowID}>
        <span className="list-index">{ ++rowID}</span>
        <div className="list-con">
          <div>
            {item.name}
            <span>{item.alia}</span>
          </div>
          <div className="singer">
            {item.ar.map(ele => ele.name)} - <span>{item.name}</span>
          </div>
        </div>
      </div>
      const separator = (sectionID, rowID) => {
        return (
          <div key={`${sectionID}-${rowID}`} style={{ height: 8.5, background: "#f5f5f5" }}>
  
          </div>
        )
      }
    return (
      <ListView
        key={this.state.useBodyScroll ? '0' : '1'}
        ref={el => (this.lv = el)}
        dataSource={this.state.dataSource}
        onEndReachedThreshold={50}
        renderFooter={() => {
          if (this.state.isLoading) {
            return (
              <div style={{ paddingBottom: 10, textAlign: 'center', fontSize: 12 }}>加载中...</div>
            );
          } else {
            return (
              <div style={{ paddingBottom: 10, textAlign: 'center', fontSize: 12 }}>
                我是有底线的
              </div>
            );
          }
        }}
        renderRow={row}
        useBodyScroll={this.state.useBodyScroll}
        onEndReached={this.onEndReached}
        initialListSize={20}
        pageSize={20}
        // pullToRefresh={
        //   <PullToRefresh
        //     damping={60}
        //     ref={el => (this.ptr = el)}
        //     style={{
        //       height: this.state.height,
        //       overflow: 'auto',
        //     }}
        //     indicator={{ deactivate: '上拉可以刷新' }}
        //     direction={'down'}
        //     refreshing={this.state.refreshing}
        //     onRefresh={this.refreshing.bind(this)}
        //   />
        // }
      />
    );
  }
}
