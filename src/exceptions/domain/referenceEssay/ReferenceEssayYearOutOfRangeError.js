class ReferenceEssayYearOutOfRangeError extends Error {
  constructor(minYear, maxYear) {
    super(`Ano deve estar entre ${minYear} e ${maxYear}.`);
    this.name = "ReferenceEssayYearOutOfRangeError";
    this.statusCode = 400;
  }
}

module.exports = ReferenceEssayYearOutOfRangeError;