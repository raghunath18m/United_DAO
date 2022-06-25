export default function handler(req, res) {
    const tokenId = req.query.tokenId;
    const image_url = "";
    res.status(200).json({
      name: "MUN" + tokenId,
      description: "MUN is collection of NFTs representing the famous players played at Manchester United FC",
      image: image_url + tokenId + ".svg",
    });
  }