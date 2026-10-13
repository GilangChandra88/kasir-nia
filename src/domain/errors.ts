/** Galat yang pesannya sudah ramah pengguna (Bahasa Indonesia) dan boleh ditampilkan apa adanya. */
export class UserFacingError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UserFacingError'
  }
}
