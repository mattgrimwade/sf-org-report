import jsforce from 'jsforce';
import { queryStringByType } from '../../lib/metadata-params';

export default async (req, res) => {
    try {
        
        console.log(req.sessionID);
        const { accessToken, instanceUrl} = req.session;
        console.log('token: ', accessToken, 'instanceUrl: ', instanceUrl);
        const body = JSON.parse(req.body)
        console.log(body);
        const sfConnection = new jsforce.Connection({
            instanceUrl : instanceUrl,
            accessToken : accessToken
        });

        const metadata = await sfConnection.tooling.query(queryStringByType[body.type]);
        console.log('metadata ', JSON.stringify(metadata));
                
        return res.status(200).json({ records: JSON.stringify(metadata) });

    } catch (e) {
        console.error(e);
        return res.status(400).json({message: 'Error retrieving metadata'})
    }
}