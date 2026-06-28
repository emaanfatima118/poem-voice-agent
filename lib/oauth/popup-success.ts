/**
 * OAuth Popup Success HTML Template
 * Returns HTML that notifies parent window and closes popup
 */

export function getOAuthSuccessHTML(platform: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Authorization Successful</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .container {
            text-align: center;
            padding: 2rem;
          }
          .checkmark {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: inline-block;
            stroke-width: 3;
            stroke: white;
            stroke-miterlimit: 10;
            margin: 2rem auto;
            box-shadow: inset 0px 0px 0px white;
            animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
          }
          .checkmark__circle {
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            stroke-width: 2;
            stroke-miterlimit: 10;
            stroke: white;
            fill: none;
            animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
          }
          .checkmark__check {
            transform-origin: 50% 50%;
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
          }
          @keyframes stroke {
            100% { stroke-dashoffset: 0; }
          }
          @keyframes scale {
            0%, 100% { transform: none; }
            50% { transform: scale3d(1.1, 1.1, 1); }
          }
          @keyframes fill {
            100% { box-shadow: inset 0px 0px 0px 30px white; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
          <h1>Successfully Connected!</h1>
          <p>This window will close automatically...</p>
        </div>
        <script>
          (function() {
            console.log('OAuth callback: Sending success message to parent');
            
            if (window.opener && !window.opener.closed) {
              // Send message multiple times to ensure delivery
              let attempts = 0;
              const maxAttempts = 5;
              
              const sendMessage = function() {
                try {
                  console.log('Attempt', attempts + 1, '- Sending message to parent');
                  window.opener.postMessage({ 
                    type: 'oauth_success', 
                    platform: '${platform}',
                    timestamp: Date.now()
                  }, window.location.origin);
                  attempts++;
                  
                  if (attempts < maxAttempts) {
                    setTimeout(sendMessage, 100);
                  } else {
                    // Close after all attempts
                    setTimeout(function() {
                      console.log('Closing popup window');
                      window.close();
                    }, 500);
                  }
                } catch (e) {
                  console.error('Error sending message:', e);
                }
              };
              
              // Start sending messages
              sendMessage();
            } else {
              // Fallback: redirect to integrations page
              console.log('No opener window, redirecting to integrations page');
              setTimeout(function() {
                window.location.href = '/integrations?success=${platform}_connected';
              }, 2000);
            }
          })();
        </script>
      </body>
    </html>
  `;
}
