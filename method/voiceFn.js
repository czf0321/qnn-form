//语音控件的一些方法
const startVoice = function(field) {
    this.setState(
        {
            voiceEnterProps: {
                show: true,
                field
            }
        },
        () => {
            this.refs.VoiceEnter.startVoice();
        }
    );
};

const onCloseVoice = function(cb) {
    this.setState(
        {
            voiceEnterProps: {
                ...this.state.voiceEnterProps,
                show: false //出现状态还是未出现状态
            }
        },
        cb
    );
};

const setFieldValueByVoice = function(val) {
    const { field } = this.state.voiceEnterProps;
    const { form } = this.props;
    const { setFieldsValue, getFieldValue } = form;
    setFieldsValue({
        [field]: `${getFieldValue(field) ? getFieldValue(field) : ""}${val}`
    });
};
export { startVoice, onCloseVoice, setFieldValueByVoice };
