import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor() { }

  showSuccess(message: string) {
    // Tailwind Toast Success Example
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  showError(message: string) {
    // Tailwind Toast Error Example
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  showInfo(message: string) {
    // Tailwind Toast Info Example
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  showConfirmation(
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) {
    // Tailwind Modal for Confirmation
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';

    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 class="text-xl font-semibold mb-4">${title}</h2>
        <p class="text-gray-600 mb-6">${message}</p>
        <div class="flex justify-end">
          <button id="cancelBtn" class="px-4 py-2 bg-gray-300 rounded-lg mr-2">Cancel</button>
          <button id="confirmBtn" class="px-4 py-2 bg-blue-500 text-white rounded-lg">Confirm</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#confirmBtn')?.addEventListener('click', () => {
      onConfirm();
      modal.remove();
    });

    modal.querySelector('#cancelBtn')?.addEventListener('click', () => {
      if (onCancel) onCancel();
      modal.remove();
    });
  }

}
