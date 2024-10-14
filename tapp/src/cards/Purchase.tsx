import { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
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
export const Purchase: React.FC = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [collectionName, setCollectionName] = useState('');
  
  useEffect(() => {
    if (token) {
      init();
      setLoading(false);
    }
  }, [token]);

  const init = async () => {
    setCollectionName(
      token.name.includes('#') ? token.name.split('#')[0] : token.name
    );
    web3.action.setProps({
      tokenId: token.tokenId,
    });
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
                Purchase: {collectionName}
              </div>
          </CardContent>
          <CardContent className="mt-6 text-[#555555] font-bold text-center">
              <img alt='cover' src={token.image_preview_url} />
          </CardContent>
          <CardContent className="mt-6 text-[#555555] font-bold text-center">
              <div className='mx-8 text-center'>
                Price: 0.001 ETH (1 unit)
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

