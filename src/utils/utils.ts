export default {
  parseBodyNumber: (body: string): number => {
    return parseInt(body, 10)
  },
  formatUnexpectedError: (error: any): { msg: string; error: string } => {
    let errorMessage: string

    if (typeof error === 'string') {
      error = error.split(': ')
      errorMessage = error[1]
    } else if (error instanceof Error) {
      errorMessage = error.message
    } else if (error.message) {
      errorMessage = error.message
    } else if (error.msg && error.error) {
      errorMessage = error.error
    } else {
      errorMessage = 'An unexpected error occurred'
    }

    return {
      msg: 'Unexpected error',
      error: errorMessage
    }
  },
  escapeRegExp: function (text: any) {
    return text.replace(/[-[\]{}()*+?.,\\$|#\s]/g, '\\$&')
  }
}
