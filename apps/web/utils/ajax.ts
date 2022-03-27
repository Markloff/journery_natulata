
const CGI_BASE_DOMAIN = 'https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod';

export enum CGI_PATH {
	AUTH = '/fake-auth'
}

type CGITypeMap = {
	[CGI_PATH.AUTH]: [
		{
			name: string;
			email: string;
		},
		string
	]
}


enum StatusCode {
	Success = 200,
	BadRequest = 400
}

type FetchCGIStandardResponse<ResType> = {
	isCGISuccess: boolean;
	errMessage: string;
	response: ResType;
}

export const fetchCGI = async <T extends keyof CGITypeMap>(path: T, data: CGITypeMap[T][0]): Promise<FetchCGIStandardResponse<CGITypeMap[T][1]>> => {
	const request = new Request(`${CGI_BASE_DOMAIN}${path}`, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json;charset=utf-8;'
		},
		body: JSON.stringify(data)
	})
	const response = await fetch(request);

	// TODO 我们以前一般是额外定义状态码在 rensponse body.data.code 里面， err message 也有额外的字段，这里先简单处理下，后续若能加入贵司，入乡随俗~
	const result = <FetchCGIStandardResponse<CGITypeMap[T][1]>>{
		isCGISuccess: true,
		errMessage: '',
		request: data,
		response: '',
	};

	if (response.status === StatusCode.Success) {
		result.isCGISuccess = true;
		result.response = await response.json();
	} else {
		result.isCGISuccess = false;
		result.errMessage = (await response.json()).errorMessage;
	}

	return result;

}
