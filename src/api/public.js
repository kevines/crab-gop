import request from '@/utils/request'
// 上传api
const uploadPath = process.env.BASE_API + '/upload/image.do'
const uploadFilePath = process.env.BASE_API + '/upload/file.do'
const uploadMiniPath = process.env.BASE_API + '/upload/mini/image.do'
// const uploadPath = '/mgr/upload'

const headImgUploadPath = '/mgr/upload'

export function upload1(data) {
  return request({
    url: '/mgr/upload',
    method: 'post',
    data
  })
}

/**
 * 删除oss内文件
 * @param {*} param 
 */
export function deleteFile(param) {
  return request({
    url: '/file/delete.do',
    method: 'post',
    params: param
  })
}
export { uploadPath, uploadMiniPath }
export { headImgUploadPath }
export { uploadFilePath }
