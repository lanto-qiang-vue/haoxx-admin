import axios from '@/libs/api.request'

export const getTableData = () => {
  return axios.request({
    baseURL: 'https://www.easy-mock.com/mock/5add9213ce4d0e69998a6f51/iview-admin/',
    url: 'get_table_data',
    method: 'get'
  })
}
