import type { NextApiRequest, NextApiResponse } from 'next';
import Twit from 'twit';

import TweetConfig from '@/utils/twitConfig';

const verifyTweet = async (tweetUrl: string) => {
  const twitConfig: any = TweetConfig;
  const Twitter = new Twit(twitConfig);
  const statusId = tweetUrl.split('/')[5];
  const { data } = await Twitter.get('statuses/show/:id', {
    id: statusId,
  });

  return Promise.resolve(data);
};

export default async function apiResult(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body);
  const { tweetUrl } = req.body;
  const isTweet = await verifyTweet(tweetUrl);
  // Rest of the API logic
  res.status(200).json({
    result: 'ok',
    tweet: isTweet,
    status: true,
    statusCode: 200,
    message: 'ok',
  });

  return res;
}
