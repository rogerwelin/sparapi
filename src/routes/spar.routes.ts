import { Router, Request, Response } from 'express';
import { personFraga }  from '../controllers/personsok';

const sparRouter = Router();

sparRouter.get('/', (req: Request, res: Response) => {
  const sid = req.query.sid;

  if (!sid) {
    return res.status(400).send({ error: 'plese use the sid query parameter' })
  }

  personFraga(sid.toString()).then(result => {
    res.setHeader('Content-type', 'application/json');
    res.send(result);
  }).catch(err => {
    return res.status(400).send({error: err.message});
  })
});


export default sparRouter;
