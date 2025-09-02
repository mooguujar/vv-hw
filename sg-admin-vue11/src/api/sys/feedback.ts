import { defHttp } from '/@/utils/http/axios';
import { feedbackSearchModel, feedbackUpdateParams } from './model/feedBackModel';

enum Api {
  feedbackList = '/app/sys/feedbackOpinion/list',
  feedbackInfo = '/app/sys/feedbackOpinion/info',
  feedbackUpdate = '/app/sys/feedbackOpinion/update',
}

/**
 * @description: Get user menu based on id
 */

export const getFeedbackList = (params?: feedbackSearchModel) => {
  return defHttp.get({ url: Api.feedbackList, params });
};

export const getFeedbackInfo = (id: number) => {
  return defHttp.get({ url: `${Api.feedbackInfo}/${id}` });
};

export const feedbackUpdate = (params: feedbackUpdateParams) => {
  return defHttp.post({ url: Api.feedbackUpdate, params }, { isTransformResponse: false });
};
