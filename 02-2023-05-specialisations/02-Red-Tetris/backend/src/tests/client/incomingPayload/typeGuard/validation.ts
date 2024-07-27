import { IMIP } from '../../../../eventsIO/payloads/types/IPayload';
import { Validator } from '../../../../base/typeGuards';
const isIMessageIncomingPayload: Validator<IMIP> = (value): value is IMIP => {
	const _value = value as IMIP;
	return (
		'message' in _value &&
		typeof _value['message'] === 'string' &&
		'receiver' in _value &&
		typeof _value['receiver'] === 'string'
	);
};

const isIncomingPayload: Validator<IMIP | string> = (value?): value is IMIP | string => {
	return isIMessageIncomingPayload(value) || typeof value === 'string';
};

export { isIncomingPayload, isIMessageIncomingPayload };
