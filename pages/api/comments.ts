import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const commentsDirectory = path.join(process.cwd(), 'posts/comments');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { slug, author, comment } = req.body;
    const commentFilePath = path.join(commentsDirectory, `${slug}.json`);
    const newComment = { author, comment, date: new Date().toISOString() };

    if (fs.existsSync(commentFilePath)) {
      const existingComments = JSON.parse(fs.readFileSync(commentFilePath, 'utf8'));
      existingComments.push(newComment);
      fs.writeFileSync(commentFilePath, JSON.stringify(existingComments, null, 2));
    } else {
      fs.writeFileSync(commentFilePath, JSON.stringify([newComment], null, 2));
    }

    res.status(200).json({ message: 'コメントを投稿しました' });
  } else {
    res.status(405).json({ message: 'メソッドが許可されていません' });
  }
}
