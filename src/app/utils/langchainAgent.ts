import AWS from 'aws-sdk';


export async function handler(history: string, question: string){
    const lambda = new AWS.Lambda({region: 'us-east-1'});

    const payload = {
        question: `${question} BEGIN RECORDS: ${history}`,
    }
    const params = {
        FunctionName: 'arn:aws:lambda:us-east-1:764201992552:function:pulse-document-processing-dev-langgraphInvoke',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(payload)
    };

    try {

        const data = await lambda.invoke(params).promise();
        return data.Payload;
        // if (typeof data.Payload === "string") {
        //     return JSON.parse(data.Payload)
        // }
    } catch (err) {
        console.log(err);
        return err
    }
}