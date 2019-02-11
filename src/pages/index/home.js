import React, { Component } from 'react';
import { Carousel, WingBlank } from 'antd-mobile';
import router from "umi/router";
import { getBanner, getPersonalized } from '@service';
import {inject,observer} from "mobx-react";
import css from './home.css';

@inject('store')
@observer
class Home extends Component {
  state = {
    bannerData: [],
    imgHeight: 176,
    personalized: []
  };
  componentDidMount() {
    this.getBanner();
    this.getPersonalized();
  }
  getBanner() {
    getBanner()
      .then(result => {
        this.setState({ bannerData: result.banners });
      })
      .catch(err => {});
  }
  getPersonalized() {
    getPersonalized()
      .then(result => {
        this.setState({personalized: result.result})
      })
      .catch(err => {});
  }
  tapBanner(e,item) {
    if( item.targetType === 1 ) {
      this.props.store.addSong(item)
      return false
    }
  }
  render() {
    const { personalized, bannerData } = this.state
    return (
      <div>
        <WingBlank>
          <Carousel
            className="space-carousel"
            frameOverflow="visible"
            cellSpacing={10}
            slideWidth={0.8}
            autoplay
            infinite
            beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
            afterChange={index => this.setState({ slideIndex: index })}
            style={{ padding: '20px 0' }}
          >
            {bannerData.map((item, index) => (
              <a
                key={item.encodeId}
                href={item.url}
                onClick={(e) => this.tapBanner(e,item)}
                style={{
                  display: 'block',
                  position: 'relative',
                  top: this.state.slideIndex === index ? -10 : 0,
                  height: this.state.imgHeight,
                  boxShadow: '2px 1px 1px rgba(0, 0, 0, 0.2)',
                }}
                alt={item.typeTitle}
              >
                <img
                  src={item.imageUrl}
                  alt=""
                  style={{ width: '100%', verticalAlign: 'top' }}
                  onLoad={() => {
                    window.dispatchEvent(new Event('resize'));
                    this.setState({ imgHeight: 'auto' });
                  }}
                />
              </a>
            ))}
          </Carousel>
        </WingBlank>
        <div className="list-title">推荐歌单 <i className="iconfont icon-youjiantou" /></div>
        <div className={css.lists}>
          {personalized.slice(0,6).map(item =><div className={css.list} key={item.id} onClick={()=>router.push('/index/playlist_detail',{id: item.id})}>
            <img src={item.picUrl} alt="" onClick={e => e.preventDefault()}/>
            <span className={css.play_count}>{parseInt(item.playCount/10000)}万<i className="iconfont icon-shiting"/></span>
            <span className={css.list_name}>{item.name}</span>
          </div> )}
        </div>
      </div>
    );
  }
}
export default Home;
