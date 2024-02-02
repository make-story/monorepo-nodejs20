import { PropsWithChildren } from 'react';

function Post({ content }: any) {
  return <></>;
}
function Picture({ url }: any) {
  return <></>;
}
function FeedItemFactory({ item }: PropsWithChildren<{ item: any }>) {
  switch (item.type) {
    case 'post':
      return <Post content={item.content} />;
    case 'picture':
      return <Picture url={item.url} />;
  }
}

const Feed = () => {
  const feed = [
    { type: 'post', content: 'test' },
    { type: 'picture', url: '//someimage.com' },
  ];

  return (
    <div>
      {feed.map((item: any, index: number) => (
        <FeedItemFactory key={index} item={item} />
      ))}
    </div>
  );
};

export default Feed;
