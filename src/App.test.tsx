import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

vi.mock('browser-image-compression', () => ({
  default: vi.fn(async (file: File, options: { fileType: string; onProgress?: (value: number) => void }) => {
    options.onProgress?.(45);
    options.onProgress?.(100);
    return new Blob([file], { type: options.fileType });
  }),
}));

const testUser = { userId: 'test_001', displayName: 'TestUser', password: 'test1234' };
const setupTestUser = () => {
  window.localStorage.setItem('bitepix_user', JSON.stringify(testUser));
  window.localStorage.setItem('bitepix_users', JSON.stringify([testUser]));
};

describe('App', () => {
  beforeEach(() => { setupTestUser(); });

  it('disables conversion until an image is uploaded', () => {
    render(<App />);

    expect(screen.getAllByText('BitePix')).toHaveLength(2);
    expect(screen.getByRole('button', { name: /convert image/i })).toBeDisabled();
  });

  it('uploads a valid image, resizes it, converts it to jpg, and exposes a download link', async () => {
    render(<App />);

    const fileInput = screen.getByLabelText(/upload image/i) as HTMLInputElement;
    const file = new File(['mock-image'], 'sample.png', { type: 'image/png' });

    await userEvent.upload(fileInput, file);

    expect(await screen.findByText('sample.png')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('1200')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('800')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/output format/i), { target: { value: 'jpg' } });

    const qualitySlider = screen.getByLabelText(/quality/i);
    fireEvent.change(qualitySlider, { target: { value: '72' } });
    fireEvent.change(screen.getByLabelText(/width/i), { target: { value: '640' } });
    fireEvent.change(screen.getByLabelText(/height/i), { target: { value: '480' } });

    await userEvent.click(screen.getByRole('button', { name: /convert image/i }));

    await waitFor(() => expect(screen.getByText(/640 x 480px/i)).toBeInTheDocument());

    expect(await screen.findByRole('link', { name: /download converted image/i })).toHaveAttribute(
      'download',
      'converted_sample.jpg'
    );
  });

  it('shows an error for unsupported files', async () => {
    render(<App />);

    const fileInput = screen.getByLabelText(/upload image/i) as HTMLInputElement;
    const file = new File(['text'], 'notes.txt', { type: 'text/plain' });

    await userEvent.upload(fileInput, file, { applyAccept: false });

    expect(
      await screen.findAllByText(/only jpg, jpeg, png, and webp images up to 50mb are allowed/i)
    ).toHaveLength(2);
  });
});
