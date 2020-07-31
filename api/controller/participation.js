const Controller = require('../controller/controller')
const Participation = require('../model/participation')

class ParticipationController extends Controller {
  browse (req) {
    const columns = [
      'id',
      'title',
      'description',
      'content',
      'created_at',
      'updated_at'
    ];

    const { query } = req
    const where = {}

    const order = '-id'

    return super.browse(req, {
      columns,
      where,
      order
    })
  }
}

module.exports = new ParticipationController(Participation)
