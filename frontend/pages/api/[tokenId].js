export default function handler(req, res) {
    const tokenId = req.query.tokenId;
    const image_url = "https://raw.githubusercontent.com/raghunath18m/United_DAO/master/frontend/public/nft-images/";
    res.status(200).json({
      name: "United Legend #" + tokenId,
      description: "MUN is collection of NFTs representing the famous players played at Manchester United FC",
      image: image_url + tokenId + ".svg",
    });
  }