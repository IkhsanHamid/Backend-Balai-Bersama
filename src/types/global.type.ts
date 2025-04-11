export type response = {
  msg: string
  data: object | null
}
export type responseController = {
  status: boolean
  statusCode: number
  message: string
  data: object | null
}

export type paginationService = {
  msg: string
  skip: number
  limit: number
  totalData: number
  totalPages: number
  currentPage: number
  data: object
}

export interface paginationController {
  status: boolean
  statusCode: number
  message: string
  skip: number
  limit: number
  totalData: number
  totalPages: number
  currentPage: number
  data: object
}
