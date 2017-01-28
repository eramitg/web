import axios from 'axios';

const state = {
  detail: null
}

const getters = {
  shipmentDetailActive(state){
    return state.detail != null;
  },
  shipmentChart({detail}){
    return detail ?
    {
      labels: detail.map(item => item.timestamp),
      datasets: [{
        data: detail.map(item => item.temperature),
        label: 'Temperature',
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 2,
        pointHitRadius: 2,
      }]
    } : {}
  }
}

const mutations = {
  setShipmentDetail(state, data) {
    state.detail = data;
  },
  resetShipmentDetail(state) {
    state.detail = null;
  }
}

const actions = {
  async getShipmentDetail({commit}, payload) {
    let {data} = await axios.get(`/api/v2/parcels/details/${payload}`);
    commit('setShipmentDetail', data);
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
