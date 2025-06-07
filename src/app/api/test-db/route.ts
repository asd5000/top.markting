import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test 1: Check services
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .limit(5)

    if (servicesError) {
      console.error('❌ Services error:', servicesError)
      return NextResponse.json({ 
        success: false, 
        error: 'Services table error',
        details: servicesError.message 
      }, { status: 500 })
    }

    // Test 2: Check customers
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .limit(5)

    if (customersError) {
      console.error('❌ Customers error:', customersError)
      return NextResponse.json({ 
        success: false, 
        error: 'Customers table error',
        details: customersError.message 
      }, { status: 500 })
    }

    // Test 3: Check settings
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .limit(10)

    if (settingsError) {
      console.error('❌ Settings error:', settingsError)
      return NextResponse.json({ 
        success: false, 
        error: 'Settings table error',
        details: settingsError.message 
      }, { status: 500 })
    }

    // Test 4: Check real estate
    const { data: realEstate, error: realEstateError } = await supabase
      .from('real_estate_listings')
      .select('*')
      .limit(5)

    if (realEstateError) {
      console.error('❌ Real estate error:', realEstateError)
      return NextResponse.json({ 
        success: false, 
        error: 'Real estate table error',
        details: realEstateError.message 
      }, { status: 500 })
    }

    console.log('✅ All database tests passed!')
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        services: {
          count: services?.length || 0,
          sample: services?.[0] || null
        },
        customers: {
          count: customers?.length || 0,
          sample: customers?.[0] || null
        },
        settings: {
          count: settings?.length || 0,
          sample: settings?.[0] || null
        },
        realEstate: {
          count: realEstate?.length || 0,
          sample: realEstate?.[0] || null
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('💥 Database test failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Database connection failed',
      details: error.message 
    }, { status: 500 })
  }
}
