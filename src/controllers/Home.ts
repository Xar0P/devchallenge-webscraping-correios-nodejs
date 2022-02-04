import express from 'express';
import Scraping from '../scripts/scrapingCorreios';

class Home {
  async index(req: express.Request, res: express.Response): Promise<void> {
    try {
      const results = await Scraping.search(req.query.cep as string) as string;
      const resultsArray = results.split('\n').map((el) => el.split('\t'));
      const resultsArrayObject = [];
      for (let i = 1; i < resultsArray.length; i++) {
        const obj: any = {};
        for (let j = 0; j < resultsArray[0].length; j++) {
          const key = resultsArray[0][j].toLowerCase();
          const value = resultsArray[i][j];

          obj[key] = value;
        }
        resultsArrayObject.push(obj);
      }

      res.json(resultsArrayObject);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'NotFound') {
          res.status(404).json({
            message: 'Resultado não encontrado!',
            status: 404,
          });
        } else res.status(500);
      } else {
        res.status(500);
      }
    }
  }
}

export default new Home();
