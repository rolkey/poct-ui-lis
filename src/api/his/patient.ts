import request from '@/utils/request';

export function getPatientList(params: any) {
  return request({
    url: '/his/patient/list',
    method: 'get',
    params
  });
}

export function getPatient(patientId: number) {
  return request({
    url: `/his/patient/${patientId}`,
    method: 'get'
  });
}

export function addPatient(data: any) {
  return request({
    url: '/his/patient',
    method: 'post',
    data
  });
}

export function updatePatient(data: any) {
  return request({
    url: '/his/patient',
    method: 'put',
    data
  });
}

export function delPatient(patientId: number) {
  return request({
    url: `/his/patient/${patientId}`,
    method: 'delete'
  });
}
