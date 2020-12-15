import {notification} from 'antd';
import {css} from 'emotion';

let color = window['colors'];

const customAlertNotify = css`
    .ant-notification-notice-content{
        .ant-notification-notice-message{
            color: ${color._BLUE_VCSC};
            font-weight: 600;
        }
    }
`

export function AlertView (data, duration = 4){
    const args = {
        message: "Thông báo",
        description: data,
        duration: duration,
        className: customAlertNotify,
        style: {
            borderRadius: 5,
            top: 20,
            fontWeight: 500
        },
        placement: 'bottomRight'
    };
    notification.open(args);
} 