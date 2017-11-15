/* eslint-env mocha */
const expect = require('chai').expect
const request = require('request')
const cheerio = require('cheerio')

const app = require('../app.js')
const lib = require('../lib/file-helper')

const requestParams = {
  url: 'http://localhost:3000/',
  headers: {
    'Content-Type': 'text/plain'
  }
}

describe('frontend app', (done) => {
  let server

  beforeEach(done => {
    server = app.listen(3000)
    done()
  })

  afterEach(done => {
    server.close()
    done()
  })

  it('should resolve with a http status code of 200', done => {
    request.get(requestParams, (err, res) => {
      expect(res).to.have.property('statusCode').to.equal(200)
      done(err)
    })
  })

  it('should resolve with a ‘Content-Type’ header of "text/html"', done => {
    request.get(requestParams, (err, res) => {
      expect(res.headers).to.have.property('content-type').to.include('text/html')
      done(err)
    })
  })

  it('should display the list of components', done => {
    request.get(requestParams, (err, res) => {
      let $ = cheerio.load(res.body)
      let componentsList = $('li').get()
      expect(componentsList.length).to.be.equal(lib.SrcComponentList.length)
      done(err)
    })
  })
})
