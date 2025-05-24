import React, { useEffect, useRef, useState } from 'react';
import { PaperAirplaneIcon, PaperClipIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import EmojiPicker from 'emoji-picker-react';

function MessageInput() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [showError, setShowError] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  const page = usePage();
  const resever_id = page.props.user ? page.props.user.id : null;
  const group_id = page.props.group ? page.props.group.id : null;

  const emojiRef = useRef<HTMLDivElement | null>(null);

  const handleEmojiClick = (emojiData: any) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleSend = async (customMessage?: string) => {
    const finalMessage = customMessage ?? message.trim();

    if (!finalMessage && !files.length) {
      setErrors(['يرجى كتابة رسالة أو رفع ملف قبل الإرسال.']);
      setShowError(true);
      return;
    }

    setShowError(false);
    setErrors([]);
    setIsSending(true);

    try {
      const formData = new FormData();
      formData.append('message', finalMessage);
      if (group_id) {
        formData.append('group_id', group_id);
      } else {
        formData.append('resever_id', resever_id);
      }

      files.forEach(file => formData.append('attechments[]', file));

      const response = await axios.post('/store_message', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        setMessage('');
        setFiles([]);
      } else {
        setErrors(['يرجى التحقق من الاتصال بالإنترنت.']);
        setShowError(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceRecord = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, {
          type: 'audio/webm',
        });

        const formData = new FormData();
        
        if (resever_id) formData.append('resever_id', resever_id);
        if (group_id) formData.append('group_id', group_id);
        formData.append('attechments[]', audioFile);

        try {
          const response = await axios.post('/store_message', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          if (response.status === 200 || response.status === 201) {
            console.log('تم إرسال التسجيل الصوتي');
          }
        } catch (error) {
          console.error('فشل في إرسال التسجيل الصوتي:', error);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

      mediaRecorder.addEventListener('stop', () => {
        setIsRecording(false);
      });

      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 60000);
    } catch (error) {
      console.error('خطأ في الميكروفون:', error);
      alert('فشل الوصول إلى الميكروفون');
    }
  };

  if (!resever_id && !group_id) return null;
  if(page.props.user && page.props.user.blocked_at || page.props.auth.user.blocked_at) return null;
  return (
    <div className="w-full relative space-y-2">
      {showError && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-error text-sm">
            {errors.map((error, index) => (
              <div key={index} className="flex items-center">
                <span className="flex-1">{error}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap md:flex-nowrap items-end gap-2 p-4 bg-base-200 dark:bg-gray-800 rounded-box">
          <textarea
            placeholder="اكتب رسالتك هنا..."
            className="textarea textarea-bordered dark:bg-gray-900 w-full resize-none min-h-[2rem] text-sm"
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        <label className="btn btn-square btn-neutral" htmlFor="fileInput">
          <PaperClipIcon className="h-5 w-5 text-white" />
          <input
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.docx,.xlsx,.pptx"
            name="attechments"
            id="fileInput"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>


        <button
          onClick={() => handleSend('👍')}
          className="btn btn-square btn-outline"
        >
          <HandThumbUpIcon className="h-5 w-5 text-blue-500" />
        </button>

        <div className="relative" ref={emojiRef}>
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="btn btn-square btn-outline text-xl"
            type="button"
          >
            😊
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-12 right-0 z-50">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleVoiceRecord}
          className={`btn btn-square ${isRecording ? 'btn-error' : 'btn-outline'}`}
          title={isRecording ? 'جاري التسجيل...' : 'تسجيل صوتي'}
        >
          {isRecording ? (
            <span className="loading loading-dots loading-md text-white"></span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 1v11m0 0a4 4 0 004-4V5a4 4 0 00-8 0v3a4 4 0 004 4zm0 0v4m0 4h4m-4 0H8"
              />
            </svg>
          )}
        </button>

        <button
          onClick={() => handleSend()}
          className="btn btn-primary btn-square"
          disabled={isSending}
        >
          {isSending ? (
            <span className="loading loading-spinner text-white w-5 h-5" />
          ) : (
            <PaperAirplaneIcon className="h-5 w-5 text-white rotate-90" />
          )}
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
