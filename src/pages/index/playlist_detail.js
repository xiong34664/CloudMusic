import React, { Component } from 'react';
import { Toast, PullToRefresh, ListView } from 'antd-mobile';
import { inject, observer } from 'mobx-react';
import { getPlaylistDetail, getSongDetail } from '@service';
import styles from './playlist_detail.css';
@inject('store')
@observer
class Playlist extends Component {
  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      playlist: {},
      privileges: [],
      listData: [],
      loading: true,
      down: false,
      height: document.documentElement.clientHeight - 50,
      pageNum: 1,
      flag: true,
      useBodyScroll: false,
      refreshing: false,
      isLoading: true,
      dataSource
    };
  }

  componentDidMount() {
    this.getDetail();
  }
  getDetail() {
    const { id } = this.props.location.state;
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
    if (!this.state.flag) {
      return;
    }
    const list = this.state.privileges.splice((this.state.pageNum - 1) * 30, 30);
    if (list.length < 30) {
      this.setState({ flag: false });
    }
    const pro = Promise.all(list.map(item => getSongDetail({ ids: item.id })));
    pro.then(res => {
      Toast.hide();
      const data = [];
      res.forEach(item => data.push(item.songs[0]));
      this.setState({
        listData: [...this.state.listData, ...data],
        loading: false,
        refreshing: false,
      });
    });
  }

  onEndReached = (event) => {
    console.log(1)
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    console.log('reach end', event);
    // this.setState({ isLoading: true });
    // setTimeout(() => {
    //   this.rData = [...this.rData, ...genData(++pageIndex)];
    //   this.setState({
    //     dataSource: this.state.dataSource.cloneWithRows(this.rData),
    //     isLoading: false,
    //   });
    // }, 1000);
  };
  render() {
    const { privileges, listData } = this.state;
    const list =
      listData.length !== 0 &&
      listData.map((item, index) => (
        <div className="song-list" key={item.id}>
          <span className="list-index">{index + 1}</span>
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
      ));
    return (
      <div>
         <PullToRefresh
          damping={60}
          ref={el => (this.ptr = el)}
          style={{
            height: this.state.height,
            overflow: 'auto',
          }}
          indicator={
            this.state.flag
              ? { deactivate: '上拉可以刷新' }
              : {
                  deactivate: '已经没有更多了',
                  activate: '你再怎么拉也没有',
                  finish: '说了没有就没有',
                }
          }
          direction={this.state.down ? 'down' : 'up'}
          refreshing={this.state.refreshing}
          onRefresh={() => {
            if (this.state.flag) {
              this.setState({ refreshing: true, pageNum: this.pageNum + 1 }, this.getList);
            } else {
              this.setState({ refreshing: false });
            }
          }}
        >{list}</PullToRefresh>
      </div>
    );
  }
}
export default Playlist;
