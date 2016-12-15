'use strict'

// spec and table at: https://github.com/multiformats/multicodec

exports = module.exports

// Miscellaneous
exports['raw'] = new Buffer('00', 'hex')

// bases encodings
exports['base1'] = new Buffer('01', 'hex')
exports['base2'] = new Buffer('55', 'hex')
exports['base8'] = new Buffer('07', 'hex')
exports['base10'] = new Buffer('09', 'hex')

// Serialization formats
exports['protobuf'] = new Buffer('50', 'hex')
exports['cbor'] = new Buffer('51', 'hex')
exports['rlp'] = new Buffer('60', 'hex')

// Multiformats
exports['multicodec'] = new Buffer('30', 'hex')
exports['multihash'] = new Buffer('31', 'hex')
exports['multiaddr'] = new Buffer('32', 'hex')
exports['multibase'] = new Buffer('33', 'hex')

// multihashes
exports['sha1'] = new Buffer('11', 'hex')
exports['sha2-256'] = new Buffer('12', 'hex')
exports['sha2-512'] = new Buffer('13', 'hex')
exports['sha3-224'] = new Buffer('17', 'hex')
exports['sha3-256'] = new Buffer('16', 'hex')
exports['sha3-384'] = new Buffer('15', 'hex')
exports['sha3-512'] = new Buffer('14', 'hex')
exports['shake-128'] = new Buffer('18', 'hex')
exports['shake-256'] = new Buffer('19', 'hex')
exports['keccak-224'] = new Buffer('1a', 'hex')
exports['keccak-256'] = new Buffer('1b', 'hex')
exports['keccak-384'] = new Buffer('1c', 'hex')
exports['keccak-512'] = new Buffer('1d', 'hex')
exports['blake2b'] = new Buffer('40', 'hex')
exports['blake2s'] = new Buffer('41', 'hex')

// multiaddrs
exports['ip4'] = new Buffer('04', 'hex')
exports['ip6'] = new Buffer('29', 'hex')
exports['tcp'] = new Buffer('06', 'hex')
exports['udp'] = new Buffer('0111', 'hex')
exports['dccp'] = new Buffer('21', 'hex')
exports['sctp'] = new Buffer('84', 'hex')
exports['udt'] = new Buffer('012d', 'hex')
exports['utp'] = new Buffer('012e', 'hex')
exports['ipfs'] = new Buffer('2a', 'hex')
exports['http'] = new Buffer('01e0', 'hex')
exports['https'] = new Buffer('01bb', 'hex')
exports['ws'] = new Buffer('01dd', 'hex')
exports['onion'] = new Buffer('01bc', 'hex')

// archiving formats

// image formats

// video formats

// VCS formats

// IPLD formats
exports['dag-pb'] = new Buffer('70', 'hex')
exports['dag-cbor'] = new Buffer('71', 'hex')
exports['eth-block'] = new Buffer('90', 'hex')
exports['eth-tx'] = new Buffer('91', 'hex')
exports['eth-account'] = new Buffer('92', 'hex')
exports['bitcoin-block'] = new Buffer('b0', 'hex')
exports['bitcoin-tx'] = new Buffer('b1', 'hex')
exports['stellar-block'] = new Buffer('d0', 'hex')
exports['stellar-tx'] = new Buffer('d1', 'hex')
