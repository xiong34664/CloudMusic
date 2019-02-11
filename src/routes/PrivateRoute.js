import AppState from '@/Mobx/AppState';
import {Provider} from 'mobx-react'

export default (props) => {
  if (props.location.pathname === '/' || props.location.pathname === '/index' || props.location.pathname === '/index/') {
    props.history.push('/index/trading_account')
    return <div />
  }
  return (
    <div>
      <Provider store={AppState}>{ props.children }</Provider>
    </div>
  );
}