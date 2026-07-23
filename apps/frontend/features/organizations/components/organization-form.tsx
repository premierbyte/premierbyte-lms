'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { organizationSchema } from '../schemas/organization-schemas';
import { UpdateOrganizationData } from '../types';
import { useOrganization } from '../hooks/use-organization';
import { toast } from 'sonner';

type Tab = 'profile' | 'branding' | 'localization';

export default function OrganizationForm() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const { organization, isLoading, updateOrganization, isUpdating } =
    useOrganization();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateOrganizationData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: '',
      slug: '',
      email: '',
      phone: '',
      address: '',
      country: '',
      state: '',
      city: '',
      timezone: 'UTC',
      locale: 'en',
      logo: '',
      favicon: '',
      primary_color: '#4f46e5',
      secondary_color: '#9333ea',
      status: 'active',
    },
  });

  useEffect(() => {
    if (organization) {
      reset({
        name: organization.name || '',
        slug: organization.slug || '',
        email: organization.email || '',
        phone: organization.phone || '',
        address: organization.address || '',
        country: organization.country || '',
        state: organization.state || '',
        city: organization.city || '',
        timezone: organization.timezone || 'UTC',
        locale: organization.locale || 'en',
        logo: organization.logo || '',
        favicon: organization.favicon || '',
        primary_color: organization.primary_color || '#4f46e5',
        secondary_color: organization.secondary_color || '#9333ea',
        status: (organization.status as any) || 'active',
      });
    }
  }, [organization, reset]);

  const primaryColor = watch('primary_color');
  const secondaryColor = watch('secondary_color');

  const onSubmit = async (data: UpdateOrganizationData) => {
    try {
      await updateOrganization(data);
      toast.success('Organization settings updated successfully!');
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        'Failed to save organization settings.';
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-12">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500" />
        <p className="text-sm font-medium text-slate-400">
          Loading organization configuration...
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10 mb-8 flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">
            Organization Profile & Settings
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Manage your organization identity, custom branding, and localization
            preferences.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 rounded-2xl border border-slate-800/80 bg-slate-950 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            General Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('branding')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'branding'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Branding & Themes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('localization')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'localization'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Localization
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-10 space-y-6"
      >
        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <div className="animate-fadeIn space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Organization Name
                </label>
                <input
                  type="text"
                  placeholder="Premierbyte Academy"
                  {...register('name')}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 placeholder-slate-600 transition-all outline-none focus:border-indigo-500"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Organization Slug
                </label>
                <input
                  type="text"
                  placeholder="premierbyte-academy"
                  {...register('slug')}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 placeholder-slate-600 transition-all outline-none focus:border-indigo-500"
                />
                {errors.slug && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.slug.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Contact Email
                </label>
                <input
                  type="email"
                  placeholder="contact@org.com"
                  {...register('email')}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 placeholder-slate-600 transition-all outline-none focus:border-indigo-500"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Contact Phone
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 019-2834"
                  {...register('phone')}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 placeholder-slate-600 transition-all outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Street Address
              </label>
              <input
                type="text"
                placeholder="100 Innovation Way"
                {...register('address')}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 placeholder-slate-600 transition-all outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  City
                </label>
                <input
                  type="text"
                  placeholder="San Francisco"
                  {...register('city')}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 placeholder-slate-600 transition-all outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  State / Province
                </label>
                <input
                  type="text"
                  placeholder="California"
                  {...register('state')}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 placeholder-slate-600 transition-all outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Country
                </label>
                <input
                  type="text"
                  placeholder="United States"
                  {...register('country')}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 placeholder-slate-600 transition-all outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Branding */}
        {activeTab === 'branding' && (
          <div className="animate-fadeIn space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                <label className="mb-3 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Primary Theme Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setValue('primary_color', e.target.value)}
                    className="h-10 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    {...register('primary_color')}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 font-mono text-sm text-slate-200 uppercase outline-none focus:border-indigo-500"
                  />
                </div>
                {errors.primary_color && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.primary_color.message}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                <label className="mb-3 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Secondary Theme Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) =>
                      setValue('secondary_color', e.target.value)
                    }
                    className="h-10 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    {...register('secondary_color')}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 font-mono text-sm text-slate-200 uppercase outline-none focus:border-indigo-500"
                  />
                </div>
                {errors.secondary_color && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.secondary_color.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Logo URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/logo.png"
                  {...register('logo')}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 placeholder-slate-600 transition-all outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Favicon URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/favicon.ico"
                  {...register('favicon')}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 placeholder-slate-600 transition-all outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Localization */}
        {activeTab === 'localization' && (
          <div className="animate-fadeIn space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Default Timezone
                </label>
                <select
                  {...register('timezone')}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-slate-200 transition-all outline-none focus:border-indigo-500"
                >
                  <option value="UTC">UTC (Universal Coordinated Time)</option>
                  <option value="America/New_York">
                    Eastern Time (US & Canada)
                  </option>
                  <option value="America/Chicago">
                    Central Time (US & Canada)
                  </option>
                  <option value="America/Denver">
                    Mountain Time (US & Canada)
                  </option>
                  <option value="America/Los_Angeles">
                    Pacific Time (US & Canada)
                  </option>
                  <option value="Europe/London">London / GMT</option>
                  <option value="Europe/Paris">
                    Paris / Central European Time
                  </option>
                  <option value="Asia/Tokyo">
                    Tokyo / Japan Standard Time
                  </option>
                </select>
                {errors.timezone && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.timezone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Default Locale
                </label>
                <select
                  {...register('locale')}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-slate-200 transition-all outline-none focus:border-indigo-500"
                >
                  <option value="en">English (en)</option>
                  <option value="es">Spanish (es)</option>
                  <option value="fr">French (fr)</option>
                  <option value="de">German (de)</option>
                  <option value="ja">Japanese (ja)</option>
                </select>
                {errors.locale && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.locale.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Account Status
              </label>
              <select
                {...register('status')}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-slate-200 transition-all outline-none focus:border-indigo-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex justify-end border-t border-slate-800 pt-6">
          <button
            type="submit"
            disabled={isUpdating}
            className="flex transform items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] disabled:opacity-50"
          >
            {isUpdating ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <span>Save Organization Settings</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
