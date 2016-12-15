'use strict'

const util = require('./util')
const cidForHash = require('./common').cidForHash

exports = module.exports

exports.multicodec = 'eth-block'

/*
 * resolve: receives a path and a block and returns the value on path,
 * throw if not possible. `block` is an IPFS Block instance (contains data + key)
 */
exports.resolve = (block, path, callback) => {
  let result
  util.deserialize(block.data, (err, node) => {
    if (err) return callback(err)

    // root
    if (!path || path === '/') {
      result = { value: node, remainderPath: '' }
      return callback(null, result)
    }

    // check tree results
    let pathParts = path.split('/')
    let firstPart = pathParts.shift()
    let remainderPath = pathParts.join('/')

    exports.tree(block, (err, paths) => {
      if (err) return callback(err)
      let treeResult = paths.find(child => child.path === firstPart)
      if (!treeResult) {
        let err = new Error('Path not found ("' + firstPart + '").')
        return callback(err)
      }

      result = {
        value: treeResult.value,
        remainderPath: remainderPath
      }
      return callback(null, result)
    })
  })
}

/*
 * tree: returns a flattened array with paths: values of the project. options
 * are option (i.e. nestness)
 */

exports.tree = (block, options, callback) => {
  // parse arguments
  if (typeof options === 'function') {
    callback = options
    options = undefined
  }
  if (!options) {
    options = {}
  }

  util.deserialize(block.data, (err, blockHeader) => {
    if (err) return callback(err)

    const paths = []

    // external links
    paths.push({
      path: 'parent',
      value: { '/': cidForHash('eth-block', blockHeader.parentHash).toBaseEncodedString() }
    })
    // paths.push({
    //   path: 'ommers',
    //   value: { '/': cidForHash('eth-block-list', blockHeader.uncleHash).toBaseEncodedString() },
    // })
    // paths.push({
    //   path: 'transactions',
    //   value: { '/': cidForHash('eth-tx-trie', blockHeader.transactionsTrie).toBaseEncodedString() },
    // })
    // paths.push({
    //   path: 'transactionReceipts',
    //   value: { '/': cidForHash('eth-tx-receipt-trie', blockHeader.receiptTrie).toBaseEncodedString() },
    // })
    // paths.push({
    //   path: 'state',
    //   value: { '/': cidForHash('eth-state-trie', blockHeader.stateRoot).toBaseEncodedString() },
    // })

    // external links as data
    paths.push({
      path: 'parentHash',
      value: blockHeader.parentHash
    })
    paths.push({
      path: 'ommerHash',
      value: blockHeader.uncleHash
    })
    paths.push({
      path: 'transactionTrieRoot',
      value: blockHeader.transactionsTrie
    })
    paths.push({
      path: 'transactionReceiptTrieRoot',
      value: blockHeader.receiptTrie
    })
    paths.push({
      path: 'stateRoot',
      value: blockHeader.stateRoot
    })

    // internal data
    paths.push({
      path: 'authorAddress',
      value: blockHeader.coinbase
    })
    paths.push({
      path: 'bloom',
      value: blockHeader.bloom
    })
    paths.push({
      path: 'difficulty',
      value: blockHeader.difficulty
    })
    paths.push({
      path: 'number',
      value: blockHeader.number
    })
    paths.push({
      path: 'gasLimit',
      value: blockHeader.gasLimit
    })
    paths.push({
      path: 'gasUsed',
      value: blockHeader.gasUsed
    })
    paths.push({
      path: 'timestamp',
      value: blockHeader.timestamp
    })
    paths.push({
      path: 'extraData',
      value: blockHeader.extraData
    })
    paths.push({
      path: 'mixHash',
      value: blockHeader.mixHash
    })
    paths.push({
      path: 'nonce',
      value: blockHeader.nonce
    })

    callback(null, paths)
  })
}
