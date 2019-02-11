import { get, post } from "@utils";
//banner图
export function getBanner(data) {
  return get('/banner',data);
}
//推荐歌单
export function getPersonalized(data) {
  return get('/personalized',data);
}
//获取歌单详情
export function getPlaylistDetail(data) {
  return get('/playlist/detail',data);
}
//获取歌曲详情
export function getSongDetail(data) {
  return get('/song/detail',data);
}