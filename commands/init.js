import fs from 'fs';

export default (folderName, options) => {

    // return console.log(options);
    let { fileName } = options;
    if(fs.existsSync(`./${folderName}`)) {
        return console.log(`Folder ${folderName} already exists!!!`);
    }
    
    if(!!folderName) {
        let capitalizedName = "";
        let camelizedName = "";
        if(!!fileName) {
            capitalizedName = getCaptializedName(fileName);
        }else {
            capitalizedName = getCaptializedName(folderName);
        }
        camelizedName = camelize(capitalizedName);
        folderName = getFolderName(folderName);
        // return;
        if(!!capitalizedName && !!camelizedName) {
            fs.mkdirSync(`./${folderName}`);
            fs.mkdirSync(`./${folderName}/dao`);
            fs.mkdirSync(`./${folderName}/model`);
            let indexTemplate = getIndexTemplate();
            indexTemplate = indexTemplate.replace(/{{FileName}}/gmi, `${capitalizedName}`);
            indexTemplate = indexTemplate.replace(/{{varFileName}}/gmi, `${camelizedName}`);
            let fileTemplate = getFileTemplate();
            fileTemplate = fileTemplate.replace(/{{FileName}}/gmi, `${capitalizedName}`);
            fileTemplate = fileTemplate.replace(/{{varFileName}}/gmi, `${camelizedName}`);
            let modelTemplate = getModelTemplate();
            modelTemplate = modelTemplate.replace(/{{FileName}}/gmi, `${capitalizedName}`);
            modelTemplate = modelTemplate.replace(/{{varFileName}}/gmi, `${camelizedName}`);
            let daoTemplate = getDaoTemplate();
            daoTemplate = daoTemplate.replace(/{{FileName}}/gmi, `${capitalizedName}`);
            daoTemplate = daoTemplate.replace(/{{varFileName}}/gmi, `${camelizedName}`);
            let configTemplate = getConfigTemplate();
            configTemplate = configTemplate.replace(/{{FileName}}/gmi, `${capitalizedName}`);
            configTemplate = configTemplate.replace(/{{varFileName}}/gmi, `${camelizedName}`);
            let deployTemplate = getDeployTemplate();
            deployTemplate = deployTemplate.replace(/{{FileName}}/gmi, `${capitalizedName}`);
            deployTemplate = deployTemplate.replace(/{{varFileName}}/gmi, `${camelizedName}`);
            let deployLiveTemplate = getDeployLiveTemplate();
            deployLiveTemplate = deployLiveTemplate.replace(/{{FileName}}/gmi, `${capitalizedName}`);
            deployLiveTemplate = deployLiveTemplate.replace(/{{varFileName}}/gmi, `${camelizedName}`);
            let UtilitiesTemplate = getUtilitiesTemplate();
            UtilitiesTemplate = UtilitiesTemplate.replace(/{{FileName}}/gmi, `${capitalizedName}`);
            UtilitiesTemplate = UtilitiesTemplate.replace(/{{varFileName}}/gmi, `${camelizedName}`);
            let packageTemplate = getPackageTemplate();
            packageTemplate = packageTemplate.replace(/{{FolderName}}/gmi, `${folderName}`);
            fs.appendFileSync(`./${folderName}/index.js`, indexTemplate);
            fs.appendFileSync(`./${folderName}/config.json`, configTemplate);
            fs.appendFileSync(`./${folderName}/deploy.sh`, deployTemplate);
            fs.appendFileSync(`./${folderName}/deployLive.sh`, deployLiveTemplate);
            fs.appendFileSync(`./${folderName}/${capitalizedName}.js`, fileTemplate);
            fs.appendFileSync(`./${folderName}/dao/${capitalizedName}.dao.js`, daoTemplate);
            fs.appendFileSync(`./${folderName}/model/UserModel.js`, modelTemplate);
            fs.appendFileSync(`./${folderName}/Utilities.js`, UtilitiesTemplate);
            fs.appendFileSync(`./${folderName}/package.json`, packageTemplate);
        }else {
            console.log('Oops! Something went wrong!!');
            return console.log('Try this command format -- spin init <your-folder-name> <FileName>');
        }
    }

    console.log(`Folder with ${folderName} created successfully!!!`);
    console.log(`Next Steps: 
        1. cd into the ${folderName} and run npm install
        2. Create the route inside the routes folder
        3. Import the route in app.js file
    `);
    console.log('Happy Coding!!!');
    return;
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

  function getCaptializedName(name) {
      let capitalizedName = "";
      let response = [];
      if(name.indexOf("-") !== -1) {
        response = name.split("-");
      }
      if(name.indexOf("_") !== -1) {
          response = name.split("_");
      }
      if(response.length > 0) {
        capitalizedName = response.map(x => capitalizeFirstLetter(x)).join("");
      }else {
          capitalizedName = name;
      }
      return capitalizedName;
  }

  function getFolderName(name) {
    let response = [];
    if(name.indexOf("-") !== -1) {
      response = name.split("-");
    }
    if(name.indexOf("_") !== -1) {
        response = name.split("_");
    }
    if(response.length > 0) {
      response = response.map(x => x.toLowerCase()).join("-");
    }else {
        response = name;
    }
    return response;
}

function getIndexTemplate() {
    return `const Sentry = require('@sentry/node');
const Sequelize = require('sequelize');

const Utilities = require('./Utilities');
const ut = new Utilities();
const config = require('./config.json')[process.env.ENV];
const {{FileName}} = require('./{{FileName}}');

const rdsConnSecretKey = config.RDS_CONNECTION;
const secretNameSentryUrl = config.SENTRY_URL;
let moengageConfig = config.MOENGAGE_DATA_API_KEY;
let moeAppIdConfig = config.MOENGAGE_APP_ID;
let moeNotifDomain = config.MOE_NOTIF_DOMAIN;
let moeNotifDomainCust = config.MOE_NOTIF_DOMAIN_CUST;
const profileUrl = config.PROFILE_S3_URL;
let redisEndPoint = config.REDIS_ENDPOINT;
let queueEndpoint = config.USER_FEED_QUEUE;

exports.handler = ut.sentryHandler(Sentry, async (event, context, callback) => {
  console.log('----- inside {{FileName}} handler -----');

  if (!!event && !!event?.input?.lambdaWarmer) {
    let responseWarmer = {
      statusCode: 200,
      body: JSON.stringify('Hello from Lambda(Warmer)!'),
    };
    console.log('Hello from Lambda(Warmer)!');
    return JSON.stringify(responseWarmer);
  }

  let message =
    !!event.Records && event.Records.length > 0 ? event.Records[0] : null;
  const receiptHandle =
    !!message && !!message.receiptHandle ? message.receiptHandle : null;
  let input = !!message ? JSON.parse(message.body) : event;

  if (process.env.ENV !== 'development') {
    console.log('top input: ', input);
  }

  let isApiCall =
    !!input.queryStringParameters ||
    !!input.body ||
    !!input.query ||
    !!input.params;
  let inputObj = {};
  if (isApiCall) {
    inputObj = Object.assign({}, input.queryStringParameters);
    if (process.env.ENV === 'development') {
      inputObj = Object.assign(inputObj, input.body || '{}');
    } else {
      inputObj = Object.assign(inputObj, JSON.parse(input.body || '{}'));
    }
    inputObj = Object.assign(inputObj, input.query || {});
    inputObj = Object.assign(inputObj, input.pathParameters || {});
    inputObj = Object.assign(inputObj, input.params || {});
    // console.log('inputObj: ', inputObj);
  }
  input = isApiCall ? inputObj : !!input && !!input.input ? input.input : input;
  console.log('lambda_input_formatted: ', input);

  let response = {
    status: 400,
    data: null,
    msg: 'Something went wrong. Please try again later',
  };

  let errorObj = {
    userMsg: 'Something went wrong, please try again later...',
    devMsg: 'Something went wrong, please try again later...',
  };

  if (!!receiptHandle) {
    ut.removeMessageFromQueue(queueEndpoint, receiptHandle);
  }

  try {
    let moeAPIKey = null,
      moeAppId = null,
      sentryUrl = null;

    // console.log('lambda_input', event);

    let secrets = await ut.getSecrets([
      secretNameSentryUrl,
      moengageConfig,
      moeAppIdConfig,
      rdsConnSecretKey,
    ]);
    // console.log(secrets);

    if (!!secrets) {
      sentryUrl =
        secrets[secretNameSentryUrl] &&
        secrets[secretNameSentryUrl][secretNameSentryUrl]
          ? secrets[secretNameSentryUrl][secretNameSentryUrl]
          : null;
      moeAPIKey =
        secrets[moengageConfig] && secrets[moengageConfig]['moeDataApiKey']
          ? secrets[moengageConfig]['moeDataApiKey']
          : null;
      moeAppId =
        secrets[moeAppIdConfig] && secrets[moeAppIdConfig]['moeAppId']
          ? secrets[moeAppIdConfig]['moeAppId']
          : null;

      Sentry.init({ dsn: sentryUrl });
    }

    console.log('input', input);

    let sequelize;
    const rdsConn = await ut.getRDSDetails(rdsConnSecretKey);

    if (process.env.ENV === 'development') {
      sequelize = await ut.getDBConnection(rdsConn);
      redisEndPoint = config.LOCAL_REDIS_ENDPOINT;
    } else {
      sequelize = new Sequelize(
        rdsConn.database,
        rdsConn.user,
        rdsConn.password,
        {
          host: rdsConn.host,
          dialect: 'mysql',
          port: rdsConn.port,
          define: {
            paranoid: true,
          },
        }
      );
    }

    if (!!input.action) {
      const {{varFileName}} = new {{FileName}}({
        sequelize,
        profileUrl,
        redisEndPoint,
        moeNotifDomain,
        moeAPIKey,
        moeAppId,
        queueEndpoint,
        moeNotifDomainCust
      });

      switch (input.action) {
        case 'action1':
          response = await {{varFileName}}.sampleAction(input);
          break;
        case 'action2':
          // response = await {{varFileName}}.updatePostManualTxn(input);
          // break;
      }
    }
    console.log('FINAL RESPONSE ', response);
    if (!!response && !!response.status) {
      response.status = 200;
    } else {
      response.status = 400;
      errorObj.devMsg = response?.data?.devMsg
        ? response?.data?.devMsg
        : errorObj.devMsg;
      errorObj.userMsg = response?.data?.userMsg
        ? response?.data?.userMsg
        : errorObj.userMsg;
    }

    //close db connection
    await ut.destructor(sequelize);
  } catch (error) {
    response.status = 400;
    response.msg = 'Error Occured in UserFeed Handler.';
    console.error('handler error', error);
    errorObj.devMsg = ''+error.name+''+':'+''+error.message+'';

    if (process.env.ENV !== 'development') {
      ut.sentryCatchedHandler(Sentry, error, context);
    }
  }

  if (isApiCall) {
    console.log('api call');

    let msg =
      !!response && response.status == 200
        ? 'OK'
        : !!response && response.status == 400
        ? 'Bad Request'
        : 'Internal Server Error';

    let resObj = {
      status: !!response && response.status == 200 ? 'A001' : 'E000',
      data: !!response && response.status == 200 ? response.data : errorObj,
      msg: !!response && response.msg ? response.msg : msg,
    };

    //local server response
    if (process.env.ENV === 'development') {
      return context.status(response?.status).json(resObj);
    }

    return callback(null, {
      statusCode: response?.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,DELETE,PUT',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resObj),
    });
  } else {
    console.log('not api call');
    return response;
  }
});
`;
}

function getFileTemplate() {
    return `const _ = require('lodash');
    let Validator = require('validatorjs');
    const {{FileName}}Dao = require('./dao/{{FileName}}.dao');
    const moment = require('moment');
    const { v4: uuidv4 } = require('uuid');
    const util = require('util');
    const redis = require('redis');
    const axios = require('axios');
    const AWS = require('aws-sdk');
    AWS.config.update({ region: 'ap-south-1' });
    const sqs = new AWS.SQS({ region: 'ap-south-1' });
    const Utilities = require('./Utilities');
    const ut = new Utilities();
    const Sequelize = require('sequelize');
    
    if (process.env.ENV === 'development') {
      AWS.config.update({
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET,
        region: process.env.AWS_REGION,
      });
    }
    
    module.exports = class {{FileName}} {
      constructor(input) {
        let { sequelize, moeAppId, moeNotifDomain, moeAPIKey, queueEndpoint, moeNotifDomainCust } =
          input;
        this.sequelize = sequelize;
        this.{{varFileName}}Dao = new {{FileName}}Dao(this.sequelize);
        this.profileUrl = input.profileUrl;
        this.redisEndPoint = input.redisEndPoint;
        this.moeAppId = moeAppId;
        this.moeNotifDomain = moeNotifDomain;
        this.moeNotifDomainCust = moeNotifDomainCust;
        this.moeAPIKey = moeAPIKey;
      }
    
      async sampleAction(input) {
        console.log('---- inside sampleAction ------');
        let response = { status: false, data: {}, msg: '' };
        try {
          let rules = {
            userId: 'required|string',
          };
    
          let validation = new Validator(input, rules);
          if (validation.fails()) {
            response.status = false;
            response.data.devMsg = this.validationErrorToString(validation);
            response.data.userMsg = 'Mandatory fields required!';
            response.msg = 'fail';
            return response;
          }
    
          let users = await this.{{varFileName}}Dao.getUserData({ userId: input.userId });
          console.log('FINAL RESPONSE GET users ', JSON.stringify(users));
          if (!users) {
            response.status = false;
            return response;
          }
          response.status = true;
          response.data = users;
          response.msg = 'success';
        } catch (err) {
          console.error('Error in sampleAction: ', {
            err: { message: err.message, stack: err.stack },
          });
        }
        return response;
      }
    
      validationErrorToString(validation) {
        return Object.values(validation.errors.all()).join(', ');
      }
    };
    `;
}

function getModelTemplate() {
    return `const Sequelize = require('sequelize');

    module.exports = class UserModel {
      constructor(sequelize) {
        this.sequelize = sequelize;
        this.setModel();
      }
    
      setModel() {
        this.model = this.sequelize.define(
          'gdp_user',
          {
            id: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
            user_status: { type: Sequelize.STRING },
            first_name: { type: Sequelize.STRING },
            middle_name: { type: Sequelize.STRING },
            last_name: { type: Sequelize.STRING },
            full_name: { type: Sequelize.STRING },
            mobile: { type: Sequelize.STRING },
            mobile_ext: { type: Sequelize.STRING },
            mobile_with_ext: { type: Sequelize.STRING },
            email_id: { type: Sequelize.STRING },
            upi_id: { type: Sequelize.STRING },
            profile_pic: { type: Sequelize.STRING },
            registration_type: { type: Sequelize.STRING },
            cognito_details: { type: Sequelize.STRING },
            device_id: { type: Sequelize.STRING },
            google_advert_id: { type: Sequelize.STRING },
            google_advert_id_added_at: { type: Sequelize.STRING },
            created_at: { type: Sequelize.DATE },
            updated_at: { type: Sequelize.DATE },
            google_advert_id_event: { type: Sequelize.STRING },
          },
          {
            freezeTableName: true,
            timestamps: false,
          }
        );
      }
      getModel() {
        return this.model;
      }
    };
    `;
}

function getDaoTemplate() {
    return `const _ = require('lodash');
    const { Op, QueryTypes } = require('sequelize');
    const UserModel = require('../model/UserModel');
    
    module.exports = class {{FileName}}Dao {
      constructor(rdsConn) {
        this.sequelize = rdsConn;
      }
    
      async getUserData(data) {
        console.log('----- inside getUserData Dao--------');
        let { userId } = data;
        let user = new UserModel(this.sequelize).getModel();
        try {
          if (!!userId) {
            let result = await user.findOne({
              where: {
                id: userId,
              },
              attributes: [
                ['id', 'userId'],
                ['full_name', 'name'],
                ['profile_pic', 'profilePic'],
                ['mobile_with_ext', 'mobileWithExt'],
                ['mobile', 'mobile'],
              ],
            });
            if (!!result) {
              result = result.get({ plain: true });
            }
            console.log(
              'STRINGIFIED DB RESPONSE FOR USER DETAILS ',
              JSON.stringify(result)
            );
            return result;
          }
        } catch (err) {
          console.error('Error in getUserData Dao: ', {
            err: { message: err.message, stack: err.stack },
          });
        }
        return null;
      }
    
      async destructor() {
        console.log('----- inside destructor -----');
        try {
          let res = await this.sequelize.close();
          console.log('destructor res: ', res);
        } catch(err) {
          console.error('Error in destructor: ', { err: { message: err.message, stack: err.stack } });
        }
        return null;
      }
    };
    `;
}

function getConfigTemplate() {
    return `{
        "development": {
          "SENTRY_URL": "sentryDsn",
          "APP_SYNC_API_KEY_NAME": "appsyncApiKey",
          "APP_SYNC_URL": "https://test.godutchpay.in/graphql",
          "REGION": "ap-south-1",
          "TABLE_SUFFIX": "",
          "EXPENSE_QUEUE": "https://sqs.ap-south-1.amazonaws.com/598266492254/Expenses.fifo",
          "PAYMENT_QUEUE": "https://sqs.ap-south-1.amazonaws.com/598266492254/Payments.fifo",
          "POST_MANUAL_TXN_QUEUE": "https://sqs.ap-south-1.amazonaws.com/598266492254/PostManualTxnRds",
          "COMM_TRANS_QUEUE_ENDPOINT": "https://sqs.ap-south-1.amazonaws.com/598266492254/CommunicationTransRds",
          "MOE_NOTIF_DOMAIN": "https://api.moengage.com/v1/event",
          "EVENT_SUBS_QUEUE_ENDPOINT": "https://sqs.ap-south-1.amazonaws.com/598266492254/EventSubscription",
          "SCRATCH_CARD_QUEUE_ENDPOINT": "https://sqs.ap-south-1.amazonaws.com/598266492254/ScratchCardRds.fifo",
          "SETTLEMENT_MILESTONE_QUEUE": "https://sqs.ap-south-1.amazonaws.com/598266492254/SettlementMilestone.fifo",
          "MOENGAGE_DATA_API_KEY": "moeDataApiKey",
          "MOENGAGE_APP_ID": "moeAppId",
          "LAMBDA_SUFFIX": "_rds",
          "RDS_CONNECTION": "rdsApplication",
          "PROFILE_S3_URL": "https://kycdoc23024-prod.s3.ap-south-1.amazonaws.com/public/",
          "MERCHANT_LOGO_ENDPOINT": "https://gdp-cdn.s3.ap-south-1.amazonaws.com/gdp-cdn/merchants/",
          "REDIS_ENDPOINT": "redis://gdp-app-api-stage.nrggal.0001.aps1.cache.amazonaws.com:6379",
          "DEBUG": true,
          "USER_CONNECTION_QUEUE": "https://sqs.ap-south-1.amazonaws.com/598266492254/UserConnections",
          "USER_FEED_QUEUE": "https://sqs.ap-south-1.amazonaws.com/598266492254/UserFeed.fifo",
          "LOCAL_REDIS_ENDPOINT": "redis://127.0.0.1:6379",
          "MOE_NOTIF_DOMAIN_CUST": "https://api.moengage.com/v1/transition"
        },
        "stage": {
          "SENTRY_URL": "sentryDsn",
          "APP_SYNC_API_KEY_NAME": "appsyncApiKey",
          "APP_SYNC_URL": "https://test.godutchpay.in/graphql",
          "REGION": "ap-south-1",
          "TABLE_SUFFIX": "",
          "EXPENSE_QUEUE": "https://sqs.ap-south-1.amazonaws.com/598266492254/Expenses.fifo",
          "PAYMENT_QUEUE": "https://sqs.ap-south-1.amazonaws.com/598266492254/Payments.fifo",
          "POST_MANUAL_TXN_QUEUE": "https://sqs.ap-south-1.amazonaws.com/598266492254/PostManualTxnRds",
          "COMM_TRANS_QUEUE_ENDPOINT": "https://sqs.ap-south-1.amazonaws.com/598266492254/CommunicationTransRds",
          "MOE_NOTIF_DOMAIN": "https://api.moengage.com/v1/event",
          "EVENT_SUBS_QUEUE_ENDPOINT": "https://sqs.ap-south-1.amazonaws.com/598266492254/EventSubscription",
          "SCRATCH_CARD_QUEUE_ENDPOINT": "https://sqs.ap-south-1.amazonaws.com/598266492254/ScratchCardRds.fifo",
          "SETTLEMENT_MILESTONE_QUEUE": "https://sqs.ap-south-1.amazonaws.com/598266492254/SettlementMilestone.fifo",
          "MOENGAGE_DATA_API_KEY": "moeDataApiKey",
          "MOENGAGE_APP_ID": "moeAppId",
          "LAMBDA_SUFFIX": "_rds",
          "RDS_CONNECTION": "rdsApplication",
          "PROFILE_S3_URL": "https://kycdoc23024-prod.s3.ap-south-1.amazonaws.com/public/",
          "MERCHANT_LOGO_ENDPOINT": "https://gdp-cdn.s3.ap-south-1.amazonaws.com/gdp-cdn/merchants/",
          "REDIS_ENDPOINT": "redis://gdp-app-api-stage.nrggal.0001.aps1.cache.amazonaws.com:6379",
          "DEBUG": true,
          "USER_CONNECTION_QUEUE": "https://sqs.ap-south-1.amazonaws.com/598266492254/UserConnections",
          "USER_FEED_QUEUE": "https://sqs.ap-south-1.amazonaws.com/598266492254/UserFeed.fifo",
          "MOE_NOTIF_DOMAIN_CUST": "https://api.moengage.com/v1/transition"
        },
        "live": {
          "SENTRY_URL": "sentryDsnLive",
          "APP_SYNC_API_KEY_NAME": "appsyncApiKeyLive",
          "APP_SYNC_URL": "https://api.godutchpay.in/graphql",
          "REGION": "ap-south-1",
          "TABLE_SUFFIX": "Live",
          "EXPENSE_QUEUE": "https://sqs.ap-south-1.amazonaws.com/598266492254/ExpensesLive.fifo",
          "PAYMENT_QUEUE": "https://sqs.ap-south-1.amazonaws.com/598266492254/PaymentsLive.fifo",
          "POST_MANUAL_TXN_QUEUE": "https://sqs.ap-south-1.amazonaws.com/598266492254/PostManualTxnLive",
          "COMM_TRANS_QUEUE_ENDPOINT": "https://sqs.ap-south-1.amazonaws.com/598266492254/CommunicationTransLive",
          "MOE_NOTIF_DOMAIN": "https://api.moengage.com/v1/event",
          "EVENT_SUBS_QUEUE_ENDPOINT": "https://sqs.ap-south-1.amazonaws.com/598266492254/EventSubscriptionLive",
          "SCRATCH_CARD_QUEUE_ENDPOINT": "https://sqs.ap-south-1.amazonaws.com/598266492254/ScratchCardLive.fifo",
          "SETTLEMENT_MILESTONE_QUEUE": "https://sqs.ap-south-1.amazonaws.com/598266492254/SettlementMilestoneLive.fifo",
          "MOENGAGE_DATA_API_KEY": "moeDataApiKeyLive",
          "MOENGAGE_APP_ID": "moeAppIdLive",
          "LAMBDA_SUFFIX": "-live",
          "RDS_CONNECTION": "rdsApplicationLive",
          "REDIS_ENDPOINT": "redis://gdp-app-api-live.nrggal.ng.0001.aps1.cache.amazonaws.com:6379",
          "PROFILE_S3_URL": "https://kycdoc23024-prod.s3.ap-south-1.amazonaws.com/public/",
          "MERCHANT_LOGO_ENDPOINT": "https://gdp-cdn.s3.ap-south-1.amazonaws.com/gdp-cdn/merchants/",
          "DEBUG": false,
          "USER_CONNECTION_QUEUE": "https://sqs.ap-south-1.amazonaws.com/598266492254/UserConnectionsLive",
          "USER_FEED_QUEUE": "https://sqs.ap-south-1.amazonaws.com/598266492254/UserFeedLive.fifo",
          "MOE_NOTIF_DOMAIN_CUST": "https://api.moengage.com/v1/transition"
        }
      }
      `;
}

function getDeployTemplate() {
    return `#!/bin/bash
    zip -r {{varFileName}}.zip .
    aws lambda update-function-code --function-name {{varFileName}}_rds --zip-file fileb://{{varFileName}}_rds.zip
    rm -r {{varFileName}}_rds.zip
    `;
}

function getDeployLiveTemplate() {
    return `#!/bin/bash
    zip -r {{varFileName}}-live.zip .
    aws lambda update-function-code --function-name {{varFileName}}-live --zip-file fileb://{{varFileName}}-live.zip
    rm -r {{varFileName}}-live.zip
    `;
}

function getUtilitiesTemplate() {
    return `let AWS = require('aws-sdk');
    const config = require('./config.json')[process.env.ENV];
    let region = config.REGION;
    const sqs = new AWS.SQS({ region: 'ap-south-1' });
    const mysql = require('mysql2/promise');
    const moment = require('moment');
    const Sequelize = require('sequelize');
    const tunnel = require('tunnel-ssh');
    
    if (process.env.ENV === 'development') {
      AWS.config.update({
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET,
        region: process.env.AWS_REGION,
      });
    }
    
    module.exports = class Utilities {
      sentryHandler(Sentry, lambdaHandler) {
        return async (event, context, callback) => {
          try {
            return await lambdaHandler(event, context, callback);
          } catch (error) {
            if (process.env.ENV !== 'development') {
              Sentry.configureScope((scope) => {
                scope.setTag('catched', 'no');
                scope.setTag('LambdaName', context.functionName);
              });
              Sentry.captureException(error);
              await Sentry.flush(2000);
            }
            if (!!error) {
              console.error('sentry_error1', error);
            }
            return error;
          }
        };
      }
    
      async sentryCatchedHandler(Sentry, error, context = {}) {
        Sentry.configureScope((scope) => {
          scope.setTag('catched', 'yes');
          scope.setTag('LambdaName', context.functionName);
        });
        if (!!error) {
          console.error('sentry_error2', error);
        }
        Sentry.captureException(error);
        await Sentry.flush(2000);
        return error;
      }
    
      client = new AWS.SecretsManager({
        region: region,
        endpoint: 'https://secretsmanager.ap-south-1.amazonaws.com',
      });
    
      getAwsSecret(secretName) {
        return this.client.getSecretValue({ SecretId: secretName }).promise();
      }
    
      async getAwsSecretAsync(secretName) {
        var error;
        console.log('sentry_secret', secretName);
        var response = await this.getAwsSecret(secretName).catch(
          (err) => (error = err)
        );
        console.log('sentry_secret_response', response);
        if (!!error) {
          console.error('sentry_secret_error', error);
        }
        return response;
      }
    
      removeMessageFromQueue(queueEndpoint, receiptHandle) {
        if (!!receiptHandle) {
          // remove message from queue
          const params = {
            QueueUrl: queueEndpoint,
            ReceiptHandle: receiptHandle,
          };
          sqs.deleteMessage(params, function (err, data) {
            if (err) {
              // an error occurred
              console.error('error_queue_remove1', err);
              console.error('error_queue_remove2', err.stack);
            } else {
              // successful response
              console.log('queue_remove_data', data);
            }
          });
        }
      }
    
      getDoubleQuotedJSON(jsonString) {
        return JSON.parse(JSON.stringify(jsonString).replace(/'/g, '"'));
      }
    
      async getSecrets(secretList) {
        let promises = [];
        let secrets = {};
        try {
          const client = new AWS.SecretsManager({ region });
          //   console.log("client: ", client);
          for (let secret of secretList) {
            promises.push(client.getSecretValue({ SecretId: secret }).promise());
          }
          return Promise.allSettled(promises).then((res) => {
            // console.log("secretValue: ", res);
            for (let item of res) {
              if (!!item.value) {
                secrets[item.value.Name] = !!item.value.SecretString
                  ? JSON.parse(item.value.SecretString)
                  : null;
              }
            }
            return secrets;
          });
        } catch (err) {
          console.error('Error in getAwsSecretAsync: ', {
            err: { message: err.message, stack: err.stack },
          });
          return secrets;
        }
      }
    
      async getRDSDetails(rdsConnSecretKey) {
        try {
          let secrets = await this.getSecrets([rdsConnSecretKey]);
          // console.log('secrets: ', secrets);
          if (!!secrets) {
            let connectionDetails = secrets[rdsConnSecretKey];
            let rdsConn = {
              host: connectionDetails.host,
              port: connectionDetails.port,
              user: connectionDetails.user,
              password: connectionDetails.password,
              database: connectionDetails.database,
            };
            return rdsConn;
          }
        } catch (err) {
          console.error('Error in getRDSDetails: ', {
            err: { message: err.message, stack: err.stack },
          });
        }
        return null;
      }
      async createPool(rdsCreds = null) {
        rdsCreds = rdsCreds || (await this.getRDSDetails());
        return mysql.createPool(rdsCreds);
      }
      
      isJsonParsable = (string) => {
        try {
          JSON.parse(string);
        } catch (e) {
          return false;
        }
        return true;
      };
    
      async destructor(sequelize) {
        console.log('----- inside destructor -----');
        try {
          let res = await sequelize.close();
          console.log('destruct the sql connection');
        } catch (err) {
          console.error('Error in destructor: ', {
            err: { message: err.message, stack: err.stack },
          });
        }
        return null;
      }
    
      async getDBConnection(rdsConn) {
        const config = {
          // I have confirmed that the local values are unnecessary (defaults work)
          // Configuration for SSH bastion
          username: process.env.EC2_USER,
          host: process.env.EC2_HOST,
          port: process.env.EC2_PORT,
          privateKey: require('fs').readFileSync(process.env.EC2_PRIVATE_KEY),
    
          // Configuration for destination (database)
          dstHost: rdsConn.host,
          dstPort: rdsConn.port,
        };
    
        // NOTE: Moved to its own function, refactor likely fixed a few issues along the way
        return new Promise(async (resolve, reject) => {
          const tnl = await tunnel(config, async (error) => {
            if (error) return reject(error);
    
            const db = new Sequelize(
              rdsConn.database,
              rdsConn.user,
              rdsConn.password,
              {
                dialect: 'mysql',
                // NOTE: This is super important as the tunnel has essentially moved code execution to the database server already...
                host: '127.0.0.1',
                port: rdsConn.port,
              }
            );
            try {
              await db.authenticate();
              console.log('Connection has been established successfully.');
            } catch (error) {
              console.error('Unable to connect to the database:', error);
            }
            return resolve(db);
          });
        });
      }
    
      async notifyUserViaCommunication(type, body) {
        try {
          console.log('----- Inside notifyUserViaCommunication -----');
          console.log('body', body);
    
          return new Promise((resolve) => {
            sqs.sendMessage(
              {
                QueueUrl: config.COMM_TRANS_QUEUE_ENDPOINT,
                MessageBody: JSON.stringify({
                  type: type,
                  payload: { contacts: body },
                }),
              },
              function (err, data) {
                if (err) {
                  console.error('Error', err);
                  return resolve({
                    status: false,
                    data: 'Comm trans enqueue failed',
                    msg: 'failure',
                  });
                } else {
                  console.log('Success', data.MessageId);
                  return resolve({
                    status: true,
                    data: 'Comm trans success',
                    msg: 'success',
                  });
                }
              }
            );
          });
        } catch (err) {
          console.error('Error in notifyUserViaCommunication', err);
          return null;
        }
      }
    };
    `;
}

function getPackageTemplate() {
    return `{
        "name": "{{folderName}}",
        "version": "1.0.0",
        "description": "user feed lambda function",
        "author": "Suraj",
        "license": "ISC",
        "dependencies": {
          "@sentry/node": "^6.14.0",
          "axios": "^0.24.0",
          "lodash": "^4.17.21",
          "moment": "^2.29.1",
          "mysql2": "^2.3.2",
          "redis": "^3.1.2",
          "sequelize": "^6.9.0",
          "shortid": "^2.2.16",
          "tunnel-ssh": "^4.1.6",
          "uuid": "^8.3.2",
          "validatorjs": "^3.22.1"
        }
      }
    `;
}