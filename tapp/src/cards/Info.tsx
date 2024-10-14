import { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import Player from '../player/player';
import { Button } from '../components/ui/button';

interface Token {
  name: string;
  contractAddress: string;
  chainId: number;
  image_preview_url?: string;
  external_link_open_graph_image?: string;
  tokenId: number;
  description?: string;
  tokenInfo?: {
    attributes?: Array<{ trait_type: string; value: string }>;
    type?: string;
  };
}

export interface RarityProps {
	token: Token;
}

// @ts-ignore
export const Info: React.FC = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [collectionName, setCollectionName] = useState('');
  const [songUrl, setSongUrl] = useState();
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (token) {
      init();
      setLoading(false);
    }
  }, [token]);

  function convertDurationToSeconds(duration:string) {
    // Split the duration string into minutes and seconds
    const [minutes, seconds] = duration.split(':').map(Number);
    
    // Convert to total seconds
    return minutes * 60 + seconds;
  }

  const init = async () => {
    setCollectionName(
      token.name.includes('#') ? token.name.split('#')[0] : token.name
    );
    const tokenUriReq = await fetch(token.tokenInfo.data.tokenUri);
    const tokenUri = await tokenUriReq.json();
    setSongUrl(tokenUri.media.audio);
    const durationAttribute = tokenUri.attributes.find((attr:any) => attr.trait_type === "Duration");
    if (durationAttribute) {
      setDuration(convertDurationToSeconds(durationAttribute.value));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="bg-white rounded-lg p-5">
		<Card className="w-full mb-6">
			<CardContent className="mt-6 text-[#555555] font-bold text-center">
          <div className='mx-8 text-center'>
            {collectionName}
          </div>
			</CardContent>
		</Card>
		<Card className="w-full my-6">
			<CardContent className="mt-6 text-[#555555] font-bold text-center">
				<Player bgImg={token.image_preview_url} duration={duration} songUrl={songUrl} />
			</CardContent>
			<CardContent className="mt-6 text-[#555555] text-center">
				{token.description}
			</CardContent>
		</Card>
      </div>
      <p className='text-center'>Like this track?</p>
      <CardContent className="mt-6 text-[#555555] font-bold text-center flex justify-center">
              <Button className='mr-1'>⭐️</Button>
              <Button className='mr-1'>⭐️</Button>
              <Button className='mr-1'>⭐️</Button>
              <Button className='mr-1'>⭐️</Button>
              <Button className='mr-1'>★</Button>
          </CardContent>
      <p className='text-center my-4'>4.5 stars (4.5k)</p>
    </div>
  );
};

