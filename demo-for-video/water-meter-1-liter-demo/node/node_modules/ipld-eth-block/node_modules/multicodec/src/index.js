'use strict'
const varint = require('varint')
const codecNameToCodeVarint = require('./varint-table')
const codeToCodecName = require('./name-table')
const util = require('./util')

exports = module.exports

exports.addPrefix = (multicodecStrOrCode, data) => {
  let prefix

  if (Buffer.isBuffer(multicodecStrOrCode)) {
    prefix = util.varintBufferEncode(multicodecStrOrCode)
  } else {
    if (codecNameToCodeVarint[multicodecStrOrCode]) {
      prefix = codecNameToCodeVarint[multicodecStrOrCode]
    } else {
      throw new Error('multicodec not recognized')
    }
  }
  return Buffer.concat([prefix, data])
}

exports.rmPrefix = (data) => {
  varint.decode(data)
  return data.slice(varint.decode.bytes)
}

exports.getCodec = (prefixedData) => {
  const code = util.varintBufferDecode(prefixedData)
  const codecName = codeToCodecName[code.toString('hex')]
  return codecName
}

